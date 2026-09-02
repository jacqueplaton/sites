"""Score de 0 a 100 e faixa (HOT/WARM/COLD/LOW).

Cada regra devolve não só o peso, mas o porquê. O detalhe fica gravado no
lead e aparece na tela de auditoria — score sem justificativa é adivinhação,
e o vendedor precisa saber o que está olhando.

Todos os pesos e limiares vêm de data/config.json (tela de Configurações).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from app.config import carregar_config
from app.models import Faixa, SituacaoSite, StatusWebsite
from app.niches import buscar_nicho


@dataclass
class RegraAplicada:
    regra: str
    descricao: str
    peso: int
    aplicado: bool
    motivo: str


@dataclass
class ResultadoScore:
    score: int
    faixa: str
    regras: list[RegraAplicada] = field(default_factory=list)
    nicho: dict[str, Any] | None = None

    def detalhe_json(self) -> list[dict[str, Any]]:
        return [
            {
                "regra": r.regra,
                "descricao": r.descricao,
                "peso": r.peso,
                "aplicado": r.aplicado,
                "motivo": r.motivo,
            }
            for r in self.regras
        ]


def _tem(valor: Any) -> bool:
    return bool(valor) and str(valor).strip() != ""


def faixa_do_score(score: int, faixas: list[dict[str, Any]]) -> str:
    for f in faixas:
        if int(f["min"]) <= score <= int(f["max"]):
            return str(f["nome"])
    return str(Faixa.LOW)


def calcular_score(lead: dict[str, Any], config: dict[str, Any] | None = None) -> ResultadoScore:
    """Aplica as regras de pontuação sobre um lead (dict ou lead.__dict__)."""
    config = config or carregar_config()
    pesos: dict[str, int] = config["pesos"]
    lim: dict[str, float] = config["limiares"]
    nichos: list[dict[str, Any]] = config["nichos"]

    nicho = buscar_nicho(lead.get("categoria"), nichos)

    site_situacao = lead.get("site_situacao") or SituacaoSite.SITE_NAO_CONFIRMADO
    website_status = lead.get("website_status") or StatusWebsite.NAO_VERIFICADO
    avaliacoes = lead.get("qtd_avaliacoes") or 0
    nota = lead.get("avaliacao")

    canais = sum(
        1
        for campo in (
            lead.get("instagram"),
            lead.get("facebook"),
            lead.get("website") if site_situacao == SituacaoSite.TEM_SITE else None,
        )
        if _tem(campo)
    )
    sinais_operacao = sum(
        1
        for campo in (
            lead.get("telefone"),
            lead.get("endereco"),
            lead.get("horario"),
            avaliacoes or None,
        )
        if _tem(campo)
    )

    regras: list[RegraAplicada] = []

    def registrar(chave: str, descricao: str, aplicado: bool, motivo: str) -> None:
        regras.append(
            RegraAplicada(chave, descricao, int(pesos.get(chave, 0)), aplicado, motivo)
        )

    sem_site = (
        site_situacao == SituacaoSite.SEM_SITE
        and website_status == StatusWebsite.NAO_ENCONTRADO
    )
    registrar(
        "sem_site_confirmado",
        "Sem site, e essa ausência foi verificada",
        sem_site,
        "verificamos e não há site" if sem_site
        else f"situação atual: {site_situacao} / {website_status}",
    )

    muitas = avaliacoes > lim["avaliacoes_muitas"]
    registrar(
        "muitas_avaliacoes",
        f"Mais de {int(lim['avaliacoes_muitas'])} avaliações",
        muitas,
        f"{avaliacoes} avaliações",
    )

    boa_nota = nota is not None and nota > lim["nota_boa"]
    registrar(
        "boa_nota",
        f"Nota acima de {lim['nota_boa']}",
        boa_nota,
        f"nota {nota}" if nota is not None else "nota não identificada",
    )

    registrar(
        "tem_telefone", "Telefone disponível", _tem(lead.get("telefone")),
        str(lead.get("telefone") or "sem telefone na base"),
    )
    registrar(
        "tem_instagram", "Instagram disponível", _tem(lead.get("instagram")),
        str(lead.get("instagram") or "sem Instagram na base"),
    )

    alto_ticket = bool(nicho and nicho.get("potencial") == "alto")
    registrar(
        "categoria_alto_ticket", "Categoria de alto ticket", alto_ticket,
        f"nicho {nicho['nome']} (potencial {nicho['potencial']})" if nicho
        else "nicho não identificado",
    )

    estabelecida = avaliacoes >= lim["avaliacoes_estabelecida"]
    registrar(
        "empresa_estabelecida",
        f"Empresa estabelecida ({int(lim['avaliacoes_estabelecida'])}+ avaliações)",
        estabelecida, f"{avaliacoes} avaliações",
    )

    fraca = canais <= lim["canais_presenca_fraca"]
    registrar(
        "presenca_digital_fraca", "Presença digital fraca", fraca,
        f"{canais} canal(is) digital(is) ativo(s)",
    )

    profissional = (
        site_situacao == SituacaoSite.TEM_SITE
        and website_status == StatusWebsite.CONFIRMADO
    )
    registrar(
        "site_profissional", "Já tem site próprio no ar", profissional,
        (lead.get("website_url_verificada") or lead.get("website") or "site confirmado")
        if profissional else f"situação atual: {site_situacao} / {website_status}",
    )

    inativa = avaliacoes == 0 and nota is None
    registrar(
        "aparentemente_inativa", "Sem qualquer avaliação registrada", inativa,
        "nenhuma avaliação e nenhuma nota" if inativa else f"{avaliacoes} avaliações",
    )

    poucos_sinais = sinais_operacao < lim["sinais_operacao_minimos"]
    registrar(
        "poucos_sinais_operacao", "Poucos sinais de operação", poucos_sinais,
        f"{sinais_operacao} sinal(is) de operação (telefone, endereço, horário, avaliações)",
    )

    bruto = sum(r.peso for r in regras if r.aplicado)
    score = max(0, min(100, bruto))
    return ResultadoScore(score, faixa_do_score(score, config["faixas"]), regras, nicho)


def aplicar_score(lead_obj, config: dict[str, Any] | None = None) -> ResultadoScore:
    """Calcula e grava score, faixa e detalhe num objeto Lead."""
    import json

    dados = {c: getattr(lead_obj, c, None) for c in (
        "categoria", "telefone", "instagram", "facebook", "website", "endereco",
        "horario", "avaliacao", "qtd_avaliacoes", "site_situacao", "website_status",
        "website_url_verificada",
    )}
    resultado = calcular_score(dados, config)
    lead_obj.score = resultado.score
    lead_obj.faixa = resultado.faixa
    lead_obj.score_detalhe = json.dumps(resultado.detalhe_json(), ensure_ascii=False)
    return resultado
