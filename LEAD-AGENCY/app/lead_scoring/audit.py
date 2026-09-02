"""Auditoria do lead — versão da Fase 1, baseada em regras.

Tudo o que aparece aqui sai de um campo do lead ou do detalhe do score. Não
há inferência sobre o negócio: quando o dado não existe, a auditoria diz
"não identificado" em vez de preencher com suposição. A camada de IA da
Fase 3 vai ampliar esta saída, nunca substituir a evidência.
"""

from __future__ import annotations

import json
from typing import Any

from app.core.config import carregar_config
from app.crm.models import Lead, SituacaoSite, StatusWebsite
from app.lead_scoring.niches import buscar_nicho

NAO_IDENTIFICADO = "não identificado"

# O que vendemos, e a condição que torna cada item defensável para o lead.
SERVICOS = {
    "site": "Site institucional",
    "seo_local": "SEO local",
    "gmn": "Google Meu Negócio",
    "ads": "Google Ads",
    "automacao": "Automação de WhatsApp",
    "manutencao": "Manutenção de site",
}


def _presenca_digital(lead: Lead) -> list[dict[str, Any]]:
    def item(canal: str, valor: Any, situacao: str, detalhe: str) -> dict[str, Any]:
        return {
            "canal": canal,
            "valor": valor or NAO_IDENTIFICADO,
            "situacao": situacao,
            "detalhe": detalhe,
        }

    if lead.site_situacao == SituacaoSite.TEM_SITE:
        site_situacao, site_detalhe = "ok", "site no ar e confirmado por requisição HTTP"
    elif lead.site_situacao == SituacaoSite.SEM_SITE:
        site_situacao, site_detalhe = "ausente", "ausência de site confirmada na verificação"
    else:
        site_situacao, site_detalhe = "indefinido", "não foi possível confirmar — falta verificar"

    return [
        item("Site", lead.website_url_verificada or lead.website, site_situacao, site_detalhe),
        item(
            "Google Meu Negócio",
            lead.google_maps_url,
            "ok" if lead.google_maps_url else "indefinido",
            "ficha localizada no Google Maps" if lead.google_maps_url
            else "não temos a URL da ficha nesta base",
        ),
        item(
            "Instagram", lead.instagram, "ok" if lead.instagram else "ausente",
            "perfil informado" if lead.instagram else "nenhum perfil na base",
        ),
        item(
            "Facebook", lead.facebook, "ok" if lead.facebook else "ausente",
            "página informada" if lead.facebook else "nenhuma página na base",
        ),
        item(
            "Telefone", lead.telefone, "ok" if lead.telefone else "ausente",
            "contato disponível" if lead.telefone else "sem telefone para abordagem",
        ),
        item(
            "Reputação",
            f"{lead.avaliacao} ({lead.qtd_avaliacoes or 0} avaliações)"
            if lead.avaliacao is not None else None,
            "ok" if (lead.qtd_avaliacoes or 0) > 0 else "indefinido",
            "avaliações públicas registradas" if (lead.qtd_avaliacoes or 0) > 0
            else "sem avaliações na base",
        ),
    ]


def _oportunidades(lead: Lead, nicho: dict[str, Any] | None) -> list[dict[str, Any]]:
    """Cada oportunidade carrega a evidência que a sustenta."""
    itens: list[dict[str, Any]] = []
    avaliacoes = lead.qtd_avaliacoes or 0

    if lead.site_situacao == SituacaoSite.SEM_SITE:
        itens.append({
            "servico": SERVICOS["site"],
            "motivo": "verificamos e a empresa não tem site próprio no ar",
            "evidencia": lead.website_evidencia or "",
        })
    elif lead.website_status == StatusWebsite.INVALIDO:
        itens.append({
            "servico": SERVICOS["site"],
            "motivo": "o endereço cadastrado não abre ou não é um site próprio",
            "evidencia": lead.website_evidencia or "",
        })
    elif lead.site_situacao == SituacaoSite.TEM_SITE:
        itens.append({
            "servico": SERVICOS["manutencao"],
            "motivo": "já existe site no ar — a conversa aqui é manutenção, performance e conteúdo",
            "evidencia": lead.website_url_verificada or lead.website or "",
        })
    else:
        itens.append({
            "servico": SERVICOS["site"],
            "motivo": "situação do site ainda não confirmada — verificar antes de abordar",
            "evidencia": lead.website_evidencia or "",
        })

    if lead.google_maps_url or avaliacoes:
        itens.append({
            "servico": SERVICOS["gmn"],
            "motivo": "a empresa já aparece no Google Maps; a ficha pode ser otimizada "
                      "(fotos, categorias, horário, respostas às avaliações)",
            "evidencia": lead.google_maps_url or f"{avaliacoes} avaliações registradas",
        })
    else:
        itens.append({
            "servico": SERVICOS["gmn"],
            "motivo": "não localizamos ficha no Google Maps nesta base — checar se existe",
            "evidencia": NAO_IDENTIFICADO,
        })

    if avaliacoes >= 20:
        itens.append({
            "servico": SERVICOS["seo_local"],
            "motivo": f"{avaliacoes} avaliações mostram volume real de clientes; "
                      "falta capturar quem busca pelo serviço na região",
            "evidencia": f"nota {lead.avaliacao} com {avaliacoes} avaliações",
        })

    if nicho and nicho.get("potencial") == "alto":
        itens.append({
            "servico": SERVICOS["ads"],
            "motivo": f"nicho de {nicho['nome'].lower()} tem ticket alto "
                      f"(referência de R$ {nicho.get('ticket_sugerido', 0):,.0f}"
                      .replace(",", ".") + "), o que sustenta investimento em mídia",
            "evidencia": f"categoria informada: {lead.categoria}",
        })

    if lead.telefone:
        itens.append({
            "servico": SERVICOS["automacao"],
            "motivo": "atendimento por telefone/WhatsApp pode ser automatizado no "
                      "primeiro contato e no agendamento",
            "evidencia": lead.telefone,
        })

    return itens


def _por_que_interessante(lead: Lead, detalhe: list[dict[str, Any]]) -> list[str]:
    """Só as regras que efetivamente pontuaram — nada de texto motivacional."""
    linhas = [
        f"{r['descricao']} ({r['peso']:+d} pontos): {r['motivo']}"
        for r in detalhe
        if r.get("aplicado") and r.get("peso", 0) > 0
    ]
    if not linhas:
        linhas.append(
            "Nenhum critério positivo foi atendido com os dados atuais — "
            "este lead não se sustenta sem informação adicional."
        )
    return linhas


def _ressalvas(lead: Lead, detalhe: list[dict[str, Any]]) -> list[str]:
    return [
        f"{r['descricao']} ({r['peso']:+d} pontos): {r['motivo']}"
        for r in detalhe
        if r.get("aplicado") and r.get("peso", 0) < 0
    ]


def auditar(lead: Lead) -> dict[str, Any]:
    config = carregar_config()
    nicho = buscar_nicho(lead.categoria, config["nichos"])

    try:
        detalhe = json.loads(lead.score_detalhe) if lead.score_detalhe else []
    except json.JSONDecodeError:  # pragma: no cover - detalhe corrompido
        detalhe = []

    return {
        "lead_id": lead.id,
        "nome_empresa": lead.nome_empresa,
        "score": lead.score,
        "faixa": lead.faixa,
        "score_detalhe": detalhe,
        "presenca_digital": _presenca_digital(lead),
        "oportunidades": _oportunidades(lead, nicho),
        "por_que_interessante": _por_que_interessante(lead, detalhe),
        "ressalvas": _ressalvas(lead, detalhe),
        "nicho": nicho,
        "argumentos": (nicho or {}).get("argumentos", []),
        "dores": (nicho or {}).get("dores", []),
        "cta": (nicho or {}).get("cta", NAO_IDENTIFICADO),
        "ticket_sugerido": (nicho or {}).get("ticket_sugerido"),
        "analise_ia": {
            "disponivel": False,
            "motivo": "a análise por IA entra na Fase 3; sem chave configurada "
                      "o app não gera texto algum",
        },
    }
