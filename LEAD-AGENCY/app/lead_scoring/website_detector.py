"""detect_missing_website() — o lead tem site ou não?

Regra central: **nunca** concluir "sem site" só porque a fonte não trouxe o
campo. Sem verificação não há conclusão; há apenas SITE_NAO_CONFIRMADO com
website_status = NAO_VERIFICADO.

Passos:
  1. ler o campo website do lead;
  2. quando ele não existe, opcionalmente procurar o domínio oficial testando
     candidatos derivados do nome da empresa (desligado por padrão);
  3. validar a resposta HTTP do endereço encontrado;
  4. registrar o nível de confiança e a evidência de cada passo.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from urllib.parse import urlparse

from app.core.config import settings
from app.lead_scoring.dedupe import DOMINIOS_SOCIAIS, sem_acento
from app.core.http_client import ClienteHTTP, cliente_http
from app.crm.models import SituacaoSite, StatusWebsite

logger = logging.getLogger(__name__)

# Frases que denunciam domínio estacionado / à venda / instalação padrão.
_SINAIS_PARKING = (
    "domain for sale", "buy this domain", "dominio a venda", "domínio à venda",
    "this domain is for sale", "parked domain", "domain parking",
    "under construction", "em construcao", "em construção",
    "site em manutencao", "default web page", "apache2 default",
    "welcome to nginx", "index of /", "coming soon", "expired domain",
    "registrado por", "hospedagem contratada",
)

_SUFIXOS_CANDIDATOS = (".com.br", ".com")


@dataclass
class ResultadoSite:
    """Saída do detector, pronta para gravar no lead."""

    site_situacao: str
    website_status: str
    confianca: float
    url_verificada: str | None = None
    evidencia: list[str] = field(default_factory=list)

    def como_dict(self) -> dict:
        return {
            "site_situacao": self.site_situacao,
            "website_status": self.website_status,
            "website_confianca": round(self.confianca, 2),
            "website_url_verificada": self.url_verificada,
            "website_evidencia": " | ".join(self.evidencia),
        }


def _url_valida(bruto: str) -> str | None:
    """Normaliza a URL. Devolve None se não for um endereço de site plausível."""
    texto = (bruto or "").strip()
    if not texto:
        return None
    if "://" not in texto:
        texto = "https://" + texto
    partes = urlparse(texto)
    if partes.scheme not in {"http", "https"}:
        return None
    host = (partes.hostname or "").lower()
    if not host or "." not in host or host.endswith("."):
        return None
    if not re.fullmatch(r"[a-z0-9.-]+", host):
        return None
    rotulos = host.split(".")
    if any(not r or r.startswith("-") or r.endswith("-") for r in rotulos):
        return None
    if len(rotulos[-1]) < 2:
        return None
    return texto


def _e_rede_social(url: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    return any(rede in host for rede in DOMINIOS_SOCIAIS)


def _parece_parking(texto: str) -> str | None:
    minusculo = sem_acento(texto).lower()
    for sinal in _SINAIS_PARKING:
        if sem_acento(sinal).lower() in minusculo:
            return sinal
    return None


def _menciona_empresa(texto: str, nome_empresa: str | None) -> bool:
    """A página cita a empresa? Usado para confirmar um domínio adivinhado."""
    if not nome_empresa:
        return False
    pagina = sem_acento(texto).lower()
    tokens = [
        t for t in re.split(r"[^a-z0-9]+", sem_acento(nome_empresa).lower())
        if len(t) >= 4
    ]
    if not tokens:
        return False
    return sum(1 for t in tokens if t in pagina) >= max(1, len(tokens) // 2)


def _candidatos_de_dominio(nome_empresa: str | None) -> list[str]:
    """Domínios plausíveis a partir do nome — usados só para *testar*, nunca afirmar."""
    if not nome_empresa:
        return []
    base = re.sub(r"[^a-z0-9]+", "", sem_acento(nome_empresa).lower())
    if len(base) < 4 or len(base) > 40:
        return []
    return [f"https://{base}{sufixo}" for sufixo in _SUFIXOS_CANDIDATOS]


def detect_missing_website(
    lead: dict,
    cliente: ClienteHTTP | None = None,
    verificar_http: bool = True,
    buscar_dominio: bool | None = None,
) -> ResultadoSite:
    """Classifica a presença de site de um lead.

    `lead` é um dicionário com pelo menos `website` e `nome_empresa`.
    `verificar_http=False` roda o detector sem tocar na rede (import em massa).
    """
    cliente = cliente or cliente_http
    if buscar_dominio is None:
        buscar_dominio = settings.buscar_dominio_candidato

    evidencia: list[str] = []
    campo = (lead.get("website") or "").strip()

    # ---------------------------------------------------------------- passo 1
    if campo:
        evidencia.append(f"campo website preenchido na fonte: {campo}")
        url = _url_valida(campo)
        if url is None:
            evidencia.append("endereço não é uma URL válida")
            return ResultadoSite(
                SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.INVALIDO, 0.3,
                None, evidencia,
            )
        if _e_rede_social(url):
            evidencia.append("aponta para rede social/agregador, não para um site próprio")
            return ResultadoSite(
                SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.INVALIDO, 0.4,
                url, evidencia,
            )
        if not verificar_http:
            evidencia.append("verificação HTTP não executada nesta rodada")
            return ResultadoSite(
                SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.NAO_VERIFICADO, 0.2,
                url, evidencia,
            )
        return _validar_http(url, lead, cliente, evidencia, adivinhado=False)

    # ---------------------------------------------------------------- passo 2
    evidencia.append("a fonte não trouxe o campo website")
    if not verificar_http or not buscar_dominio:
        evidencia.append(
            "busca por domínio oficial desligada — ausência do campo não prova ausência de site"
        )
        return ResultadoSite(
            SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.NAO_VERIFICADO, 0.0,
            None, evidencia,
        )

    candidatos = _candidatos_de_dominio(lead.get("nome_empresa"))
    if not candidatos:
        evidencia.append("nome da empresa não gera domínio candidato testável")
        return ResultadoSite(
            SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.NAO_VERIFICADO, 0.0,
            None, evidencia,
        )

    testados: list[str] = []
    falhas_nossas: list[str] = []
    for candidato in candidatos:
        resposta = cliente.obter(candidato)
        testados.append(urlparse(candidato).hostname or candidato)
        if not resposta.ok:
            # Uma falha nossa (proxy, timeout, sem rota) não diz nada sobre o
            # domínio. Só "não resolve" é evidência de que o endereço não existe.
            if getattr(resposta, "falha_nossa", False):
                falhas_nossas.append(f"{candidato}: {resposta.erro}")
            continue
        if not _menciona_empresa(resposta.texto, lead.get("nome_empresa")):
            evidencia.append(
                f"{candidato} respondeu, mas a página não menciona a empresa — inconclusivo"
            )
            return ResultadoSite(
                SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.NAO_VERIFICADO, 0.3,
                str(resposta.url_final or candidato), evidencia,
            )
        evidencia.append(f"domínio candidato {candidato} responde e menciona a empresa")
        return _validar_http(candidato, lead, cliente, evidencia, adivinhado=True)

    if falhas_nossas:
        evidencia.append(
            "não foi possível testar os domínios candidatos — a falha foi nossa, "
            "não do destino (" + "; ".join(falhas_nossas[:3]) + ")"
        )
        return ResultadoSite(
            SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.NAO_VERIFICADO, 0.0,
            None, evidencia,
        )

    evidencia.append(
        "domínios candidatos testados, nenhum resolve: " + ", ".join(testados)
    )
    return ResultadoSite(
        SituacaoSite.SEM_SITE, StatusWebsite.NAO_ENCONTRADO, 0.6, None, evidencia
    )


def _validar_http(
    url: str,
    lead: dict,
    cliente: ClienteHTTP,
    evidencia: list[str],
    adivinhado: bool,
) -> ResultadoSite:
    """Passos 3 e 4: bate na URL, lê o resultado e atribui confiança."""
    if not cliente.robots_permite(url):
        evidencia.append("robots.txt do host não permite a leitura — não verificamos")
        return ResultadoSite(
            SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.NAO_VERIFICADO, 0.2,
            url, evidencia,
        )

    resposta = cliente.obter(url)
    if resposta.erro:
        if getattr(resposta, "falha_nossa", False):
            evidencia.append(
                f"não conseguimos acessar ({resposta.erro}) — a falha foi nossa, "
                "o site pode estar no ar"
            )
            return ResultadoSite(
                SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.NAO_VERIFICADO, 0.0,
                url, evidencia,
            )
        evidencia.append(f"o domínio não resolve ({resposta.erro})")
        return ResultadoSite(
            SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.INVALIDO, 0.5, url, evidencia
        )

    evidencia.append(f"HTTP {resposta.status} em {resposta.url_final or url}")

    if resposta.status is not None and resposta.status >= 400:
        return ResultadoSite(
            SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.INVALIDO, 0.5, url, evidencia
        )

    parking = _parece_parking(resposta.texto)
    if parking:
        evidencia.append(f"página parece estacionada/em construção ('{parking}')")
        return ResultadoSite(
            SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.INVALIDO, 0.6, url, evidencia
        )

    if len(resposta.texto.strip()) < 200:
        evidencia.append("resposta com conteúdo mínimo — não dá para confirmar um site real")
        return ResultadoSite(
            SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.NAO_VERIFICADO, 0.4,
            url, evidencia,
        )

    if _e_rede_social(str(resposta.url_final or url)):
        evidencia.append("o endereço redireciona para rede social — não é site próprio")
        return ResultadoSite(
            SituacaoSite.SITE_NAO_CONFIRMADO, StatusWebsite.INVALIDO, 0.6, url, evidencia
        )

    confianca = 0.75 if adivinhado else 0.95
    if _menciona_empresa(resposta.texto, lead.get("nome_empresa")):
        evidencia.append("a página menciona o nome da empresa")
        confianca = min(1.0, confianca + 0.05)

    return ResultadoSite(
        SituacaoSite.TEM_SITE,
        StatusWebsite.CONFIRMADO,
        confianca,
        str(resposta.url_final or url),
        evidencia,
    )
