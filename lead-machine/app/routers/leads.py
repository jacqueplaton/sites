"""API de leads: CRUD, filtros, status, verificação de site e auditoria."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status as http
from sqlalchemy.orm import Session

from app import crud
from app.audit import auditar
from app.database import get_db
from app.dedupe import LeadDuplicadoError, encontrar_duplicata
from app.models import Lead
from app.routers.dependencias import FiltrosDep
from app.schemas import (
    DuplicataSaida,
    LeadAtualizar,
    LeadCriar,
    LeadSaida,
    MudancaStatus,
    PaginaLeads,
)

router = APIRouter(prefix="/api/leads", tags=["leads"])

DB = Annotated[Session, Depends(get_db)]


def _erro_duplicata(exc: LeadDuplicadoError) -> HTTPException:
    return HTTPException(
        status_code=http.HTTP_409_CONFLICT,
        detail={
            "mensagem": "Lead duplicado — cadastro bloqueado.",
            "duplicata": DuplicataSaida(
                lead_id=exc.duplicata.lead_id,
                nome_empresa=exc.duplicata.nome_empresa,
                motivo=exc.duplicata.motivo,
                similaridade=round(exc.duplicata.similaridade, 3),
            ).model_dump(),
        },
    )


def _obter(db: Session, lead_id: int) -> Lead:
    lead = crud.obter_lead(db, lead_id)
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead não encontrado.")
    return lead


@router.get("", response_model=PaginaLeads)
def listar(
    db: DB,
    filtros: FiltrosDep,
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(25, ge=1, le=500),
) -> PaginaLeads:
    itens, total = crud.listar_leads(db, filtros, pagina, por_pagina)
    return PaginaLeads(
        total=total,
        pagina=pagina,
        por_pagina=por_pagina,
        paginas=max(1, -(-total // por_pagina)),
        itens=[LeadSaida.model_validate(i) for i in itens],
    )


@router.post("", response_model=LeadSaida, status_code=http.HTTP_201_CREATED)
def criar(
    dados: LeadCriar,
    db: DB,
    verificar_site: bool = Query(False, description="valida o site por HTTP ao cadastrar"),
) -> LeadSaida:
    try:
        lead = crud.criar_lead(db, dados.model_dump(exclude_none=False), verificar_site)
    except LeadDuplicadoError as exc:
        raise _erro_duplicata(exc) from exc
    return LeadSaida.model_validate(lead)


@router.post("/checar-duplicata", response_model=DuplicataSaida | None)
def checar_duplicata(dados: LeadCriar, db: DB) -> DuplicataSaida | None:
    """Consulta sem gravar — usada pelo formulário antes de enviar."""
    duplicata = encontrar_duplicata(db, dados.model_dump())
    if not duplicata:
        return None
    return DuplicataSaida(
        lead_id=duplicata.lead_id,
        nome_empresa=duplicata.nome_empresa,
        motivo=duplicata.motivo,
        similaridade=round(duplicata.similaridade, 3),
    )


@router.get("/{lead_id}", response_model=LeadSaida)
def detalhar(lead_id: int, db: DB) -> LeadSaida:
    return LeadSaida.model_validate(_obter(db, lead_id))


@router.put("/{lead_id}", response_model=LeadSaida)
def atualizar(lead_id: int, dados: LeadAtualizar, db: DB) -> LeadSaida:
    lead = _obter(db, lead_id)
    try:
        atualizado = crud.atualizar_lead(db, lead, dados.model_dump(exclude_unset=True))
    except LeadDuplicadoError as exc:
        raise _erro_duplicata(exc) from exc
    return LeadSaida.model_validate(atualizado)


@router.delete("/{lead_id}", status_code=http.HTTP_204_NO_CONTENT)
def excluir(lead_id: int, db: DB) -> None:
    crud.excluir_lead(db, _obter(db, lead_id))


@router.post("/{lead_id}/status", response_model=LeadSaida)
def mudar_status(lead_id: int, dados: MudancaStatus, db: DB) -> LeadSaida:
    lead = crud.mudar_status(db, _obter(db, lead_id), str(dados.status), dados.observacao)
    return LeadSaida.model_validate(lead)


@router.post("/{lead_id}/verificar-site", response_model=LeadSaida)
def verificar_site(lead_id: int, db: DB) -> LeadSaida:
    """Executa detect_missing_website() com acesso HTTP e regrava o score."""
    lead = crud.verificar_site_do_lead(db, _obter(db, lead_id))
    return LeadSaida.model_validate(lead)


@router.get("/{lead_id}/auditoria")
def auditoria(lead_id: int, db: DB) -> dict:
    return auditar(_obter(db, lead_id))
