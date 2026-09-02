"""Operações de banco: criar, consultar, filtrar e atualizar leads.

Todo caminho de criação passa pela deduplicação e pelo score — não existe
lead entrando na base sem essas duas etapas.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session

from app.config import carregar_config
from app.dedupe import (
    Duplicata,
    LeadDuplicadoError,
    chaves_do_lead,
    encontrar_duplicata,
    normalizar_texto,
)
from app.models import Faixa, Lead, SituacaoSite, StatusLead, StatusWebsite
from app.schemas import Filtros
from app.scoring import aplicar_score
from app.website_detector import detect_missing_website

logger = logging.getLogger(__name__)


def criar_lead(
    db: Session,
    dados: dict[str, Any],
    verificar_site: bool = False,
    checar_duplicata: bool = True,
) -> Lead:
    """Cria um lead. Levanta LeadDuplicadoError se a empresa já estiver na base."""
    dados = {k: v for k, v in dados.items() if v is not None or k in {"website"}}

    if checar_duplicata:
        duplicata = encontrar_duplicata(db, dados)
        if duplicata:
            raise LeadDuplicadoError(duplicata)

    campos_lead = {c.name for c in Lead.__table__.columns}
    lead = Lead(**{k: v for k, v in dados.items() if k in campos_lead})
    if not lead.data_coleta:
        lead.data_coleta = datetime.now(timezone.utc)
    if not lead.status:
        lead.status = StatusLead.NOVO

    for chave, valor in chaves_do_lead(dados).items():
        setattr(lead, chave, valor)

    # Se o chamador já trouxe o resultado de uma verificação anterior
    # (import de base própria, seeds), respeitamos: rodar o detector aqui
    # sobrescreveria um dado verificado por um "não verificado".
    ja_classificado = "site_situacao" in dados and "website_status" in dados
    if not ja_classificado:
        aplicar_detector(lead, verificar_http=verificar_site)
    elif verificar_site:
        aplicar_detector(lead, verificar_http=True)
    aplicar_score(lead)

    db.add(lead)
    db.commit()
    db.refresh(lead)
    logger.info("lead #%s criado: %s (score %s)", lead.id, lead.nome_empresa, lead.score)
    return lead


def atualizar_lead(db: Session, lead: Lead, dados: dict[str, Any]) -> Lead:
    """Atualiza campos e recalcula chaves/score. Bloqueia se virar duplicata de outro."""
    campos_lead = {c.name for c in Lead.__table__.columns}
    for campo, valor in dados.items():
        if campo in campos_lead:
            setattr(lead, campo, valor)

    combinado = {
        "nome_empresa": lead.nome_empresa,
        "telefone": lead.telefone,
        "website": lead.website,
        "endereco": lead.endereco,
        "google_maps_url": lead.google_maps_url,
        "cidade": lead.cidade,
    }
    duplicata = encontrar_duplicata(db, combinado, ignorar_id=lead.id)
    if duplicata:
        db.rollback()
        raise LeadDuplicadoError(duplicata)

    for chave, valor in chaves_do_lead(combinado).items():
        setattr(lead, chave, valor)

    if "website" in dados:
        aplicar_detector(lead, verificar_http=False)
    aplicar_score(lead)
    db.commit()
    db.refresh(lead)
    return lead


def aplicar_detector(lead: Lead, verificar_http: bool = True, cliente=None) -> None:
    """Roda detect_missing_website() e grava o resultado no lead."""
    resultado = detect_missing_website(
        {"website": lead.website, "nome_empresa": lead.nome_empresa},
        cliente=cliente,
        verificar_http=verificar_http,
    )
    for campo, valor in resultado.como_dict().items():
        setattr(lead, campo, valor)
    if verificar_http:
        lead.website_verificado_em = datetime.now(timezone.utc)


def verificar_site_do_lead(db: Session, lead: Lead, cliente=None) -> Lead:
    aplicar_detector(lead, verificar_http=True, cliente=cliente)
    aplicar_score(lead)
    db.commit()
    db.refresh(lead)
    return lead


def recalcular_scores(db: Session) -> int:
    """Recalcula o score de toda a base — usado quando os pesos mudam."""
    config = carregar_config(forcar=True)
    leads = db.execute(select(Lead)).scalars().all()
    for lead in leads:
        aplicar_score(lead, config)
    db.commit()
    return len(leads)


def obter_lead(db: Session, lead_id: int) -> Lead | None:
    return db.get(Lead, lead_id)


def excluir_lead(db: Session, lead: Lead) -> None:
    db.delete(lead)
    db.commit()


def mudar_status(db: Session, lead: Lead, status: str, observacao: str | None = None) -> Lead:
    lead.status = status
    if observacao:
        carimbo = datetime.now(timezone.utc).strftime("%d/%m/%Y %H:%M")
        anterior = (lead.observacoes or "").strip()
        nova = f"[{carimbo}] {status}: {observacao}"
        lead.observacoes = f"{anterior}\n{nova}".strip()
    db.commit()
    db.refresh(lead)
    return lead


# --------------------------------------------------------------------------
# Filtros
# --------------------------------------------------------------------------

_ORDENACOES = {
    "score": Lead.score.asc(),
    "-score": Lead.score.desc(),
    "nome": Lead.nome_empresa.asc(),
    "-nome": Lead.nome_empresa.desc(),
    "recentes": Lead.criado_em.desc(),
    "avaliacoes": Lead.qtd_avaliacoes.asc(),
    "-avaliacoes": Lead.qtd_avaliacoes.desc(),
}


def _preenchido(coluna):
    return coluna.isnot(None) & (func.trim(coluna) != "")


def montar_consulta(filtros: Filtros) -> Select:
    consulta = select(Lead)

    if filtros.q:
        alvo = f"%{filtros.q.strip()}%"
        consulta = consulta.where(
            or_(
                Lead.nome_empresa.ilike(alvo),
                Lead.categoria.ilike(alvo),
                Lead.endereco.ilike(alvo),
                Lead.descricao.ilike(alvo),
            )
        )
    if filtros.cidade:
        consulta = consulta.where(Lead.cidade.ilike(f"%{filtros.cidade.strip()}%"))
    if filtros.estado:
        consulta = consulta.where(Lead.estado.ilike(f"%{filtros.estado.strip()}%"))
    if filtros.categoria:
        consulta = consulta.where(Lead.categoria.ilike(f"%{filtros.categoria.strip()}%"))
    if filtros.status:
        consulta = consulta.where(Lead.status.in_([str(s) for s in filtros.status]))
    if filtros.faixa:
        consulta = consulta.where(Lead.faixa.in_([str(f) for f in filtros.faixa]))
    if filtros.site:
        consulta = consulta.where(Lead.site_situacao == str(filtros.site))
    if filtros.website_status:
        consulta = consulta.where(Lead.website_status == str(filtros.website_status))
    if filtros.score_min is not None:
        consulta = consulta.where(Lead.score >= filtros.score_min)
    if filtros.score_max is not None:
        consulta = consulta.where(Lead.score <= filtros.score_max)
    if filtros.avaliacao_min is not None:
        consulta = consulta.where(Lead.avaliacao >= filtros.avaliacao_min)
    if filtros.avaliacoes_min is not None:
        consulta = consulta.where(
            func.coalesce(Lead.qtd_avaliacoes, 0) >= filtros.avaliacoes_min
        )
    if filtros.tem_telefone is not None:
        cond = _preenchido(Lead.telefone)
        consulta = consulta.where(cond if filtros.tem_telefone else ~cond)
    if filtros.tem_instagram is not None:
        cond = _preenchido(Lead.instagram)
        consulta = consulta.where(cond if filtros.tem_instagram else ~cond)
    if filtros.tem_website is not None:
        cond = _preenchido(Lead.website)
        consulta = consulta.where(cond if filtros.tem_website else ~cond)

    return consulta.order_by(_ORDENACOES.get(filtros.ordenar, Lead.score.desc()), Lead.id.desc())


def listar_leads(
    db: Session, filtros: Filtros, pagina: int = 1, por_pagina: int = 25
) -> tuple[list[Lead], int]:
    consulta = montar_consulta(filtros)
    total = db.execute(
        select(func.count()).select_from(consulta.order_by(None).subquery())
    ).scalar_one()
    pagina = max(1, pagina)
    por_pagina = max(1, min(por_pagina, 500))
    itens = (
        db.execute(consulta.limit(por_pagina).offset((pagina - 1) * por_pagina))
        .scalars()
        .all()
    )
    return list(itens), int(total)


def todos_filtrados(db: Session, filtros: Filtros) -> list[Lead]:
    return list(db.execute(montar_consulta(filtros)).scalars().all())


# --------------------------------------------------------------------------
# Dashboard
# --------------------------------------------------------------------------

_STATUS_RESPOSTA = {
    StatusLead.RESPONDEU, StatusLead.INTERESSADO, StatusLead.REUNIAO,
    StatusLead.PROPOSTA, StatusLead.NEGOCIACAO, StatusLead.FECHADO,
    StatusLead.NAO_INTERESSADO,
}
_STATUS_ABORDADO = _STATUS_RESPOSTA | {StatusLead.ABORDADO, StatusLead.PERDIDO}
_STATUS_PROPOSTA = {
    StatusLead.PROPOSTA, StatusLead.NEGOCIACAO, StatusLead.FECHADO, StatusLead.PERDIDO
}


def _pct(parte: int, total: int) -> float:
    return round(parte / total * 100, 1) if total else 0.0


def resumo_dashboard(db: Session, filtros: Filtros | None = None) -> dict[str, Any]:
    leads = todos_filtrados(db, filtros or Filtros())
    total = len(leads)

    por_status: dict[str, int] = {str(s): 0 for s in StatusLead}
    por_faixa: dict[str, int] = {str(f): 0 for f in Faixa}
    for lead in leads:
        por_status[lead.status] = por_status.get(lead.status, 0) + 1
        por_faixa[lead.faixa] = por_faixa.get(lead.faixa, 0) + 1

    sem_site = sum(
        1 for lead in leads
        if lead.site_situacao == SituacaoSite.SEM_SITE
        and lead.website_status == StatusWebsite.NAO_ENCONTRADO
    )
    abordados = sum(1 for lead in leads if lead.status in _STATUS_ABORDADO)
    respostas = sum(1 for lead in leads if lead.status in _STATUS_RESPOSTA)
    interessados = sum(
        1 for lead in leads
        if lead.status in {
            StatusLead.INTERESSADO, StatusLead.REUNIAO, StatusLead.PROPOSTA,
            StatusLead.NEGOCIACAO, StatusLead.FECHADO,
        }
    )
    propostas = sum(1 for lead in leads if lead.status in _STATUS_PROPOSTA)
    fechados = [lead for lead in leads if lead.status == StatusLead.FECHADO]
    valor_vendido = sum(lead.valor_proposta or 0 for lead in fechados)

    def agrupar(campo: str, rotulo_padrao: str) -> list[dict[str, Any]]:
        grupos: dict[str, dict[str, Any]] = {}
        for lead in leads:
            bruto = getattr(lead, campo, None)
            chave = (bruto or rotulo_padrao).strip() or rotulo_padrao
            g = grupos.setdefault(
                chave, {"chave": chave, "leads": 0, "abordados": 0, "vendas": 0, "valor": 0.0}
            )
            g["leads"] += 1
            if lead.status in _STATUS_ABORDADO:
                g["abordados"] += 1
            if lead.status == StatusLead.FECHADO:
                g["vendas"] += 1
                g["valor"] += lead.valor_proposta or 0
        for g in grupos.values():
            g["conversao"] = _pct(g["vendas"], g["leads"])
        return sorted(grupos.values(), key=lambda g: (-g["leads"], g["chave"]))

    return {
        "total_leads": total,
        "sem_site": sem_site,
        "hot": por_faixa.get(str(Faixa.HOT), 0),
        "abordados": abordados,
        "respostas": respostas,
        "interessados": interessados,
        "propostas": propostas,
        "vendas": len(fechados),
        "taxa_resposta": _pct(respostas, abordados),
        "taxa_conversao": _pct(len(fechados), total),
        "valor_vendido": round(valor_vendido, 2),
        "ticket_medio": round(valor_vendido / len(fechados), 2) if fechados else 0.0,
        "por_faixa": por_faixa,
        "por_status": por_status,
        "por_nicho": agrupar("categoria", "sem categoria"),
        "por_cidade": agrupar("cidade", "sem cidade"),
        "por_abordagem": agrupar("tipo_abordagem", "não registrada"),
    }


def valores_distintos(db: Session, coluna) -> list[str]:
    linhas = db.execute(select(coluna).where(coluna.isnot(None)).distinct()).scalars().all()
    vistos: dict[str, str] = {}
    for valor in linhas:
        limpo = (valor or "").strip()
        if limpo:
            vistos.setdefault(normalizar_texto(limpo), limpo)
    return sorted(vistos.values(), key=str.casefold)


__all__ = [
    "criar_lead", "atualizar_lead", "obter_lead", "excluir_lead", "mudar_status",
    "listar_leads", "todos_filtrados", "resumo_dashboard", "recalcular_scores",
    "verificar_site_do_lead", "aplicar_detector", "valores_distintos",
    "Duplicata", "LeadDuplicadoError",
]
