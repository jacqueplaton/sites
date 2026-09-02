"""Configuração da suíte.

Cada execução usa um banco e um config.json temporários — nada aqui toca a
base real nem a rede. As variáveis de ambiente são definidas antes de
importar o app, porque a engine do SQLAlchemy é criada no import.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest

_TMP = Path(tempfile.mkdtemp(prefix="leadagency-testes-"))
os.environ["LM_DB_PATH"] = str(_TMP / "teste.db")
os.environ["LM_CONFIG_PATH"] = str(_TMP / "config.json")
os.environ["LM_HTTP_CACHE_MIN"] = "0"
os.environ["LM_HTTP_INTERVALO_HOST"] = "0"
os.environ["LM_BUSCAR_DOMINIO_CANDIDATO"] = "false"
os.environ.pop("ANTHROPIC_API_KEY", None)
os.environ.pop("OPENAI_API_KEY", None)

from fastapi.testclient import TestClient  # noqa: E402

from app.app import criar_app  # noqa: E402
from app.core.config import limpar_cache_config  # noqa: E402
from app.core.database import Base, SessionLocal, engine  # noqa: E402
from app.core.http_client import Resposta  # noqa: E402


@pytest.fixture(autouse=True)
def base_limpa():
    """Recria as tabelas antes de cada teste."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    limpar_cache_config()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    sessao = SessionLocal()
    try:
        yield sessao
    finally:
        sessao.close()


@pytest.fixture
def cliente():
    with TestClient(criar_app()) as c:
        yield c


class ClienteFalso:
    """Substitui o cliente HTTP nos testes. Nenhuma requisição sai da máquina."""

    def __init__(self, respostas: dict[str, Resposta] | None = None, robots: bool = True):
        self.respostas = respostas or {}
        self.robots = robots
        self.chamadas: list[str] = []

    def obter(self, url: str) -> Resposta:
        self.chamadas.append(url)
        if url in self.respostas:
            return self.respostas[url]
        return Resposta(url=url, erro="ConnectError: host de teste sem resposta")

    def robots_permite(self, url: str) -> bool:
        return self.robots


@pytest.fixture
def cliente_falso():
    return ClienteFalso


def pagina(titulo: str, corpo: str = "") -> str:
    """HTML com volume suficiente para o detector considerar um site real."""
    return f"<html><head><title>{titulo}</title></head><body><h1>{titulo}</h1>" + (
        corpo or "<p>" + ("conteúdo institucional da empresa. " * 20) + "</p>"
    ) + "</body></html>"
