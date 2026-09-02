"""Deduplicação de leads.

Chave composta: nome (similaridade fuzzy) + telefone + endereço +
google_maps_url + domínio do site. A regra é bloquear o cadastro duplicado —
a mesma empresa coletada duas vezes vira contato repetido, e contato
repetido é exatamente o que não podemos fazer.

A similaridade usa difflib da biblioteca padrão: sem dependência extra e
suficiente para nomes de empresa depois de normalizados.
"""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from difflib import SequenceMatcher
from typing import TYPE_CHECKING
from urllib.parse import urlparse

from sqlalchemy import or_, select

if TYPE_CHECKING:  # pragma: no cover
    from sqlalchemy.orm import Session

    from app.models import Lead

# Ruído que aparece na razão social e atrapalha a comparação de nomes.
_TERMOS_GENERICOS = {
    "ltda", "me", "epp", "eireli", "sa", "s", "a", "cia", "e",
    "de", "da", "do", "das", "dos", "e", "the", "-",
}

LIMIAR_NOME = 0.87
LIMIAR_NOME_FORTE = 0.95
LIMIAR_ENDERECO = 0.80


def sem_acento(texto: str) -> str:
    normal = unicodedata.normalize("NFKD", texto)
    return "".join(c for c in normal if not unicodedata.combining(c))


def normalizar_texto(texto: str | None) -> str:
    """Minúsculas, sem acento, sem pontuação, espaços colapsados."""
    if not texto:
        return ""
    limpo = sem_acento(texto).lower()
    limpo = re.sub(r"[^a-z0-9]+", " ", limpo)
    return re.sub(r"\s+", " ", limpo).strip()


def normalizar_nome(nome: str | None) -> str:
    """Normaliza e remove termos societários genéricos (ltda, me, eireli...)."""
    base = normalizar_texto(nome)
    if not base:
        return ""
    palavras = [p for p in base.split() if p not in _TERMOS_GENERICOS]
    return " ".join(palavras) if palavras else base


def normalizar_telefone(telefone: str | None) -> str:
    """Só dígitos, sem DDI 55 e sem zero de operadora. Menos de 8 dígitos vira vazio."""
    if not telefone:
        return ""
    digitos = re.sub(r"\D", "", telefone)
    if digitos.startswith("55") and len(digitos) > 10:
        digitos = digitos[2:]
    digitos = digitos.lstrip("0")
    return digitos if len(digitos) >= 8 else ""


def extrair_dominio(url: str | None) -> str:
    """Domínio em minúsculas, sem www e sem porta. Ignora redes sociais."""
    if not url:
        return ""
    bruto = url.strip()
    if not bruto:
        return ""
    if "://" not in bruto:
        bruto = "http://" + bruto
    try:
        host = (urlparse(bruto).hostname or "").lower()
    except ValueError:
        return ""
    if host.startswith("www."):
        host = host[4:]
    if not host or "." not in host:
        return ""
    if any(rede in host for rede in DOMINIOS_SOCIAIS):
        return ""
    return host


DOMINIOS_SOCIAIS = (
    "instagram.com", "facebook.com", "fb.com", "linktr.ee", "wa.me",
    "whatsapp.com", "linkedin.com", "twitter.com", "x.com", "tiktok.com",
    "youtube.com", "google.com", "goo.gl", "maps.app.goo.gl", "linktree",
    "bio.link", "beacons.ai",
)


def normalizar_endereco(endereco: str | None) -> str:
    """Normaliza e abrevia os logradouros mais comuns, para 'Rua'/'R.' casarem."""
    base = normalizar_texto(endereco)
    if not base:
        return ""
    trocas = {
        "avenida": "av", "rua": "r", "rodovia": "rod", "alameda": "al",
        "travessa": "tv", "praca": "pc", "estrada": "est", "numero": "",
        "n": "", "no": "", "apto": "", "sala": "", "andar": "", "conjunto": "",
    }
    palavras = [trocas.get(p, p) for p in base.split()]
    return " ".join(p for p in palavras if p)


def normalizar_maps(url: str | None) -> str:
    if not url:
        return ""
    return url.strip().rstrip("/").lower()


def similaridade(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()


@dataclass
class Duplicata:
    """Motivo pelo qual um lead foi considerado repetido."""

    lead_id: int
    nome_empresa: str
    motivo: str
    similaridade: float


class LeadDuplicadoError(Exception):
    def __init__(self, duplicata: Duplicata) -> None:
        super().__init__(
            f"Lead duplicado de #{duplicata.lead_id} ({duplicata.nome_empresa}): "
            f"{duplicata.motivo}"
        )
        self.duplicata = duplicata


def chaves_do_lead(dados: dict) -> dict[str, str]:
    """Chaves normalizadas gravadas junto com o lead."""
    return {
        "chave_nome": normalizar_nome(dados.get("nome_empresa")),
        "chave_telefone": normalizar_telefone(dados.get("telefone")),
        "chave_dominio": extrair_dominio(dados.get("website")),
        "chave_endereco": normalizar_endereco(dados.get("endereco")),
        "chave_maps": normalizar_maps(dados.get("google_maps_url")),
    }


def encontrar_duplicata(
    db: "Session", dados: dict, ignorar_id: int | None = None
) -> Duplicata | None:
    """Procura um lead já cadastrado que seja a mesma empresa.

    Ordem das regras, da mais forte para a mais fraca:

    1. mesma URL do Google Maps  → é o mesmo ponto no mapa;
    2. mesmo telefone            → mesma linha de atendimento;
    3. mesmo domínio de site     → mesma empresa na internet;
    4. nome parecido + mesma cidade + (endereço parecido ou mesmo telefone).

    Só a regra 4 usa fuzzy; as três primeiras são igualdade exata sobre o
    valor normalizado.
    """
    from app.models import Lead

    chaves = chaves_do_lead(dados)
    filtros = []
    if chaves["chave_maps"]:
        filtros.append(Lead.chave_maps == chaves["chave_maps"])
    if chaves["chave_telefone"]:
        filtros.append(Lead.chave_telefone == chaves["chave_telefone"])
    if chaves["chave_dominio"]:
        filtros.append(Lead.chave_dominio == chaves["chave_dominio"])

    if filtros:
        consulta = select(Lead).where(or_(*filtros))
        if ignorar_id is not None:
            consulta = consulta.where(Lead.id != ignorar_id)
        for existente in db.execute(consulta).scalars():
            if chaves["chave_maps"] and existente.chave_maps == chaves["chave_maps"]:
                motivo = "mesma URL do Google Maps"
            elif (
                chaves["chave_telefone"]
                and existente.chave_telefone == chaves["chave_telefone"]
            ):
                motivo = f"mesmo telefone ({chaves['chave_telefone']})"
            else:
                motivo = f"mesmo domínio de site ({chaves['chave_dominio']})"
            return Duplicata(existente.id, existente.nome_empresa, motivo, 1.0)

    # Regra fuzzy: restringe pela cidade para não varrer a base inteira.
    if not chaves["chave_nome"]:
        return None
    consulta = select(Lead)
    cidade = normalizar_texto(dados.get("cidade"))
    if cidade:
        consulta = consulta.where(Lead.cidade.isnot(None))
    if ignorar_id is not None:
        consulta = consulta.where(Lead.id != ignorar_id)

    for existente in db.execute(consulta).scalars():
        if cidade and normalizar_texto(existente.cidade) != cidade:
            continue
        parecido = similaridade(chaves["chave_nome"], existente.chave_nome or "")
        if parecido < LIMIAR_NOME:
            continue
        end_parecido = similaridade(chaves["chave_endereco"], existente.chave_endereco or "")
        mesmo_telefone = bool(
            chaves["chave_telefone"]
            and chaves["chave_telefone"] == (existente.chave_telefone or "")
        )
        # Sem endereço nem telefone dos dois lados não há como distinguir duas
        # empresas de nome praticamente igual na mesma cidade. Bloqueamos: um
        # falso duplicado se resolve editando o lead; um contato repetido, não.
        sem_como_distinguir = (
            not chaves["chave_endereco"] and not (existente.chave_endereco or "")
            and not chaves["chave_telefone"] and not (existente.chave_telefone or "")
            and parecido >= LIMIAR_NOME_FORTE
        )
        if end_parecido >= LIMIAR_ENDERECO or mesmo_telefone or sem_como_distinguir:
            motivo = (
                f"nome {parecido:.0%} parecido com '{existente.nome_empresa}' "
                f"na mesma cidade"
            )
            if end_parecido >= LIMIAR_ENDERECO:
                motivo += f" e endereço {end_parecido:.0%} parecido"
            elif sem_como_distinguir:
                motivo += " (sem endereço ou telefone que os diferencie)"
            return Duplicata(existente.id, existente.nome_empresa, motivo, parecido)
    return None
