"""Fábrica da aplicação FastAPI."""

from __future__ import annotations

import logging
import time

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app import __version__
from app.config import BASE_DIR, carregar_config, configurar_logs, settings
from app.database import criar_tabelas
from app.routers import configuracoes, dashboard, importexport, leads, paginas

logger = logging.getLogger("lead_machine")


def criar_app() -> FastAPI:
    configurar_logs()

    aplicacao = FastAPI(
        title="LEAD MACHINE",
        description=(
            "Prospecção de negócios locais: coleta, qualificação, auditoria e CRM. "
            "Toda mensagem gerada é rascunho para revisão humana — o app não envia nada."
        ),
        version=__version__,
    )

    criar_tabelas()
    carregar_config()

    aplicacao.mount(
        "/static",
        StaticFiles(directory=str(BASE_DIR / "web" / "static")),
        name="static",
    )

    for router in (
        leads.router,
        dashboard.router,
        configuracoes.router,
        importexport.router,
        paginas.router,
    ):
        aplicacao.include_router(router)

    @aplicacao.middleware("http")
    async def registrar_tempo(request: Request, call_next):
        inicio = time.monotonic()
        resposta = await call_next(request)
        duracao = (time.monotonic() - inicio) * 1000
        if request.url.path.startswith("/api"):
            logger.info(
                "%s %s -> %s (%.0f ms)",
                request.method, request.url.path, resposta.status_code, duracao,
            )
        return resposta

    @aplicacao.exception_handler(Exception)
    async def erro_inesperado(request: Request, exc: Exception):  # pragma: no cover
        logger.exception("erro não tratado em %s", request.url.path)
        return JSONResponse(
            status_code=500,
            content={"detail": "Erro interno. Confira os logs do servidor."},
        )

    @aplicacao.get("/api/saude", tags=["infra"])
    def saude() -> dict:
        return {
            "status": "ok",
            "versao": __version__,
            "banco": str(settings.db_path),
            "ia_disponivel": settings.tem_chave_ia(),
        }

    return aplicacao


app = criar_app()
