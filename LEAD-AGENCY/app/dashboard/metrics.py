"""Métricas do dashboard.

Tudo é derivado dos leads que passam pelos filtros da tela: nenhuma métrica
tem tabela própria, então não existe número no painel que não possa ser
reconferido abrindo a lista com o mesmo filtro.
"""

from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.crm.crud import todos_filtrados
from app.crm.models import Faixa, SituacaoSite, StatusLead, StatusWebsite
from app.crm.schemas import Filtros


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
