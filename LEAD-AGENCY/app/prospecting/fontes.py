"""Fontes de coleta de leads (Fase 2).

Cada fonte implementa `buscar()` e devolve dicionários no formato do Lead.
Quem grava é o `crud.criar_lead`, então dedupe, detector de site e score
valem igual para qualquer fonte — nenhuma delas escreve direto no banco.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass
class ParametrosBusca:
    """O que a tela Buscar Leads manda para a fonte."""

    cidade: str
    nicho: str
    estado: str | None = None
    pais: str = "Brasil"
    quantidade: int = 20
    raio_km: float = 10.0
    avaliacao_min: float | None = None
    avaliacoes_min: int | None = None
    so_sem_site: bool = False
    so_com_telefone: bool = False
    so_com_instagram: bool = False


@dataclass
class ResultadoBusca:
    """O que a fonte devolve: os leads e o que ela não conseguiu entregar."""

    leads: list[dict[str, Any]] = field(default_factory=list)
    encontrados: int = 0
    descartados_por_filtro: int = 0
    avisos: list[str] = field(default_factory=list)
    erro: str | None = None


class FonteDeLeads(Protocol):
    nome: str

    def buscar(self, parametros: ParametrosBusca) -> ResultadoBusca: ...


def fonte_por_nome(nome: str) -> FonteDeLeads:
    from app.prospecting.overpass import FonteOverpass
    from app.prospecting.places import FontePlaces

    fontes = {"openstreetmap": FonteOverpass(), "google_places": FontePlaces()}
    if nome not in fontes:
        disponiveis = ", ".join(sorted(fontes))
        raise ValueError(f"fonte '{nome}' não existe. Disponíveis: {disponiveis}")
    return fontes[nome]


def fontes_disponiveis() -> list[dict[str, Any]]:
    """O que a interface mostra no seletor de fonte.

    A Places API só aparece como disponível quando há chave em
    GOOGLE_MAPS_API_KEY. Sem chave, nenhuma requisição é feita — o app não
    finge integração que não tem.
    """
    from app.core.config import settings

    return [
        {
            "id": "openstreetmap",
            "nome": "OpenStreetMap (Overpass)",
            "disponivel": True,
            "custo": "gratuita",
            "limitacao": "cobertura irregular; quase nunca traz nota, "
                         "número de avaliações ou perfil de rede social",
        },
        {
            "id": "google_places",
            "nome": "Google Places API",
            "disponivel": settings.tem_chave_places(),
            "custo": "paga, por requisição, com conta de faturamento no Google Cloud",
            "limitacao": "traz site, telefone, nota e nº de avaliações — é a única "
                         "que permite qualificar por reputação. Máximo de 60 "
                         "resultados por consulta. Exige GOOGLE_MAPS_API_KEY no "
                         ".env; confira a tabela de preços oficial antes de rodar "
                         "em volume",
        },
    ]
