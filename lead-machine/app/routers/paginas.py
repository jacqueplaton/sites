"""Páginas da interface. O HTML é só a casca; os dados vêm da API por fetch."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app import crud
from app.config import BASE_DIR
from app.database import get_db

router = APIRouter(tags=["páginas"])
templates = Jinja2Templates(directory=str(BASE_DIR / "web" / "templates"))

DB = Annotated[Session, Depends(get_db)]

MENU = [
    ("/", "Dashboard", "dashboard"),
    ("/buscar", "Buscar Leads", "buscar"),
    ("/leads", "Leads", "leads"),
    ("/crm", "CRM", "crm"),
    ("/auditoria", "Auditoria", "auditoria"),
    ("/configuracoes", "Configurações", "configuracoes"),
]


def _pagina(request: Request, template: str, pagina: str, **extra) -> HTMLResponse:
    return templates.TemplateResponse(
        request=request,
        name=template,
        context={"menu": MENU, "pagina": pagina, **extra},
    )


@router.get("/", response_class=HTMLResponse)
def dashboard(request: Request) -> HTMLResponse:
    return _pagina(request, "dashboard.html", "dashboard")


@router.get("/buscar", response_class=HTMLResponse)
def buscar(request: Request) -> HTMLResponse:
    return _pagina(request, "buscar.html", "buscar")


@router.get("/leads", response_class=HTMLResponse)
def leads(request: Request) -> HTMLResponse:
    return _pagina(request, "leads.html", "leads")


@router.get("/crm", response_class=HTMLResponse)
def crm(request: Request) -> HTMLResponse:
    return _pagina(request, "crm.html", "crm")


@router.get("/auditoria", response_class=HTMLResponse)
def auditoria_lista(request: Request) -> HTMLResponse:
    return _pagina(request, "auditoria.html", "auditoria", lead_id=None)


@router.get("/auditoria/{lead_id}", response_class=HTMLResponse)
def auditoria(lead_id: int, request: Request, db: DB) -> HTMLResponse:
    if crud.obter_lead(db, lead_id) is None:
        raise HTTPException(status_code=404, detail="Lead não encontrado.")
    return _pagina(request, "auditoria.html", "auditoria", lead_id=lead_id)


@router.get("/configuracoes", response_class=HTMLResponse)
def configuracoes(request: Request) -> HTMLResponse:
    return _pagina(request, "configuracoes.html", "configuracoes")
