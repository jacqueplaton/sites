"""Import de CSV, export de CSV/XLSX e carga dos seeds fictícios."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.exporter import exportar_csv, exportar_xlsx, nome_arquivo
from app.importer import importar_csv
from app.routers.dependencias import FiltrosDep
from app.schemas import RelatorioImport
from app.seeds import semear

router = APIRouter(prefix="/api", tags=["import/export"])

DB = Annotated[Session, Depends(get_db)]

TAMANHO_MAXIMO = 10 * 1024 * 1024  # 10 MB


@router.post("/import/csv", response_model=RelatorioImport)
async def importar(
    db: DB,
    arquivo: Annotated[UploadFile, File(description="CSV com os leads")],
) -> RelatorioImport:
    conteudo = await arquivo.read()
    if not conteudo:
        raise HTTPException(status_code=400, detail="arquivo vazio")
    if len(conteudo) > TAMANHO_MAXIMO:
        raise HTTPException(status_code=413, detail="arquivo acima de 10 MB")
    fonte = f"csv:{arquivo.filename}" if arquivo.filename else "csv"
    return RelatorioImport(**importar_csv(db, conteudo, fonte_padrao=fonte))


@router.get("/export/csv")
def exportar_em_csv(db: DB, filtros: FiltrosDep) -> Response:
    conteudo = exportar_csv(crud.todos_filtrados(db, filtros))
    return Response(
        content=conteudo,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{nome_arquivo("csv")}"'},
    )


@router.get("/export/xlsx")
def exportar_em_xlsx(db: DB, filtros: FiltrosDep) -> Response:
    conteudo = exportar_xlsx(crud.todos_filtrados(db, filtros))
    return Response(
        content=conteudo,
        media_type=(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ),
        headers={"Content-Disposition": f'attachment; filename="{nome_arquivo("xlsx")}"'},
    )


@router.post("/seeds")
def carregar_seeds(db: DB, forcar: bool = False) -> dict:
    """Popula a base com leads fictícios para demonstrar o fluxo."""
    return semear(db, forcar=forcar)
