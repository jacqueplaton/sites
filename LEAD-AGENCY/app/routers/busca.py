"""Busca de leads em fontes externas (Fase 2).

A rota só orquestra: pede os registros à fonte e manda cada um para o
`criar_lead`, que aplica dedupe, detector de site e score. Nada entra na base
por fora desse caminho.
"""

from __future__ import annotations

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.crm.crud import criar_lead
from app.core.database import get_db
from app.lead_scoring.dedupe import LeadDuplicadoError
from app.prospecting.fontes import ParametrosBusca, fonte_por_nome, fontes_disponiveis
from app.crm.schemas import LeadSaida

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/busca", tags=["busca"])

DB = Annotated[Session, Depends(get_db)]


class PedidoBusca(BaseModel):
    fonte: str = "openstreetmap"
    cidade: str = Field(min_length=2, max_length=120)
    nicho: str = Field(min_length=2, max_length=120)
    estado: str | None = Field(default=None, max_length=60)
    pais: str = "Brasil"
    quantidade: int = Field(default=20, ge=1, le=200)
    raio: float = Field(default=10, ge=0.5, le=50)
    avaliacao_min: float | None = Field(default=None, ge=0, le=5)
    avaliacoes_min: int | None = Field(default=None, ge=0)
    so_sem_site: bool = False
    so_com_telefone: bool = False
    so_com_instagram: bool = False


@router.get("/fontes")
def listar_fontes() -> list[dict]:
    return fontes_disponiveis()


@router.post("")
def buscar(pedido: PedidoBusca, db: DB) -> dict:
    try:
        fonte = fonte_por_nome(pedido.fonte)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    parametros = ParametrosBusca(
        cidade=pedido.cidade, nicho=pedido.nicho, estado=pedido.estado, pais=pedido.pais,
        quantidade=pedido.quantidade, raio_km=pedido.raio,
        avaliacao_min=pedido.avaliacao_min, avaliacoes_min=pedido.avaliacoes_min,
        so_sem_site=pedido.so_sem_site, so_com_telefone=pedido.so_com_telefone,
        so_com_instagram=pedido.so_com_instagram,
    )

    resultado = fonte.buscar(parametros)
    if resultado.erro:
        raise HTTPException(status_code=502, detail=resultado.erro)

    novos: list[LeadSaida] = []
    duplicados: list[dict] = []
    erros: list[dict] = []

    for registro in resultado.leads:
        try:
            lead = criar_lead(db, registro, verificar_site=False)
            novos.append(LeadSaida.model_validate(lead))
        except LeadDuplicadoError as exc:
            duplicados.append({
                "nome_empresa": registro.get("nome_empresa"),
                "lead_existente": exc.duplicata.lead_id,
                "motivo": exc.duplicata.motivo,
            })
        except Exception as exc:  # pragma: no cover - registro estranho da fonte
            db.rollback()
            erros.append({"nome_empresa": registro.get("nome_empresa"), "erro": str(exc)[:200]})
            logger.warning("falha ao gravar lead da fonte %s: %s", pedido.fonte, exc)

    logger.info(
        "busca %s em %s/%s: %s encontrados, %s novos, %s duplicados",
        pedido.nicho, pedido.cidade, pedido.fonte,
        resultado.encontrados, len(novos), len(duplicados),
    )

    return {
        "fonte": pedido.fonte,
        "encontrados_na_fonte": resultado.encontrados,
        "descartados_por_filtro": resultado.descartados_por_filtro,
        "novos": len(novos),
        "duplicados": len(duplicados),
        "erros": len(erros),
        "avisos": resultado.avisos,
        "detalhes_duplicados": duplicados[:100],
        "detalhes_erros": erros[:100],
        "leads": [lead.model_dump(mode="json") for lead in novos],
        "proximo_passo": (
            "Os leads entraram como NOVO, com o site ainda NAO_VERIFICADO. "
            "Rode 'Verificar site agora' na auditoria antes de tratar qualquer "
            "um deles como 'sem site'."
        ),
    }
