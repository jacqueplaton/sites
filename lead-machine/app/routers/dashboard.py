"""Métricas do dashboard e listas auxiliares para os filtros."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.models import Faixa, Lead, SituacaoSite, StatusLead, StatusWebsite
from app.routers.dependencias import FiltrosDep

router = APIRouter(prefix="/api", tags=["dashboard"])

DB = Annotated[Session, Depends(get_db)]


@router.get("/dashboard")
def dashboard(db: DB, filtros: FiltrosDep) -> dict:
    return crud.resumo_dashboard(db, filtros)


@router.get("/opcoes")
def opcoes(db: DB) -> dict:
    """Valores existentes na base + enums, para montar os selects da interface."""
    return {
        "status": [str(s) for s in StatusLead],
        "faixas": [str(f) for f in Faixa],
        "situacoes_site": [str(s) for s in SituacaoSite],
        "status_website": [str(s) for s in StatusWebsite],
        "cidades": crud.valores_distintos(db, Lead.cidade),
        "estados": crud.valores_distintos(db, Lead.estado),
        "categorias": crud.valores_distintos(db, Lead.categoria),
    }
