"""Dependências compartilhadas pelos routers."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Query

from app.models import Faixa, SituacaoSite, StatusLead, StatusWebsite
from app.schemas import Filtros


def filtros_da_query(
    q: Annotated[str | None, Query(description="busca livre por nome/categoria/endereço")] = None,
    cidade: str | None = None,
    estado: str | None = None,
    categoria: Annotated[str | None, Query(description="nicho/categoria")] = None,
    status: Annotated[list[StatusLead] | None, Query()] = None,
    faixa: Annotated[list[Faixa] | None, Query()] = None,
    site: SituacaoSite | None = None,
    website_status: StatusWebsite | None = None,
    score_min: int | None = None,
    score_max: int | None = None,
    avaliacao_min: float | None = None,
    avaliacoes_min: int | None = None,
    tem_telefone: bool | None = None,
    tem_instagram: bool | None = None,
    tem_website: bool | None = None,
    ordenar: str = "-score",
) -> Filtros:
    return Filtros(
        q=q, cidade=cidade, estado=estado, categoria=categoria, status=status,
        faixa=faixa, site=site, website_status=website_status, score_min=score_min,
        score_max=score_max, avaliacao_min=avaliacao_min, avaliacoes_min=avaliacoes_min,
        tem_telefone=tem_telefone, tem_instagram=tem_instagram, tem_website=tem_website,
        ordenar=ordenar if ordenar in {
            "score", "-score", "nome", "-nome", "recentes", "avaliacoes", "-avaliacoes"
        } else "-score",
    )


FiltrosDep = Annotated[Filtros, Depends(filtros_da_query)]
