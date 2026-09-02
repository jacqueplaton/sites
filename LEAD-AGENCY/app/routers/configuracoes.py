"""Configurações editáveis: pesos do score, limiares, faixas e nichos."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crm import crud
from app.core.config import carregar_config, config_padrao, salvar_config, settings
from app.core.database import get_db
from app.crm.schemas import ConfiguracaoEntrada

router = APIRouter(prefix="/api/config", tags=["configuração"])

DB = Annotated[Session, Depends(get_db)]


@router.get("")
def obter() -> dict:
    config = carregar_config()
    return {
        **config,
        "ia_disponivel": settings.tem_chave_ia(),
        "buscar_dominio_candidato": settings.buscar_dominio_candidato,
    }


@router.put("")
def salvar(dados: ConfiguracaoEntrada, db: DB) -> dict:
    """Grava a configuração e recalcula o score de toda a base."""
    padrao = config_padrao()
    faltando = set(padrao["pesos"]) - set(dados.pesos)
    if faltando:
        raise HTTPException(
            status_code=422,
            detail=f"faltam pesos na configuração: {', '.join(sorted(faltando))}",
        )
    if not dados.faixas:
        raise HTTPException(status_code=422, detail="defina ao menos uma faixa de score")

    salvo = salvar_config(dados.model_dump())
    atualizados = crud.recalcular_scores(db)
    return {**salvo, "leads_recalculados": atualizados}


@router.post("/restaurar")
def restaurar(db: DB) -> dict:
    salvo = salvar_config(config_padrao())
    atualizados = crud.recalcular_scores(db)
    return {**salvo, "leads_recalculados": atualizados}
