"""Configuração do app: variáveis de ambiente e ajustes editáveis pelo usuário.

Duas camadas, com propósitos diferentes:

* variáveis de ambiente (.env) — infraestrutura e segredos. Só o backend lê.
* data/config.json — pesos do score e catálogo de nichos, que o usuário
  edita pela tela de Configurações sem reiniciar o app.
"""

from __future__ import annotations

import json
import logging
import os
import threading
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / ".env")


def _bool(nome: str, padrao: bool) -> bool:
    valor = os.getenv(nome)
    if valor is None:
        return padrao
    return valor.strip().lower() in {"1", "true", "yes", "sim", "on"}


def _num(nome: str, padrao: float) -> float:
    try:
        return float(os.getenv(nome, padrao))
    except (TypeError, ValueError):
        return padrao


class Settings:
    """Configuração vinda do ambiente. Lida uma vez, no import."""

    def __init__(self) -> None:
        self.db_path: Path = Path(os.getenv("LM_DB_PATH", "data/leads.db"))
        if not self.db_path.is_absolute():
            self.db_path = BASE_DIR / self.db_path

        self.host: str = os.getenv("LM_HOST", "127.0.0.1")
        self.port: int = int(_num("LM_PORT", 8000))
        self.log_level: str = os.getenv("LM_LOG_LEVEL", "INFO").upper()

        self.http_timeout: float = _num("LM_HTTP_TIMEOUT", 8)
        self.http_retries: int = int(_num("LM_HTTP_RETRIES", 2))
        self.http_intervalo_host: float = _num("LM_HTTP_INTERVALO_HOST", 1.0)
        self.http_cache_min: float = _num("LM_HTTP_CACHE_MIN", 60)
        self.user_agent: str = os.getenv(
            "LM_USER_AGENT",
            "LeadAgency/1.0 (+prospeccao-local)",
        )
        self.buscar_dominio_candidato: bool = _bool("LM_BUSCAR_DOMINIO_CANDIDATO", False)

        # Endereços das APIs do OpenStreetMap. Configuráveis porque a Overpass
        # tem espelhos públicos com limites diferentes, e porque uma instância
        # própria é a saída para quem coleta em volume.
        self.nominatim_url: str = os.getenv(
            "LM_NOMINATIM_URL", "https://nominatim.openstreetmap.org/search"
        )
        self.overpass_url: str = os.getenv(
            "LM_OVERPASS_URL", "https://overpass-api.de/api/interpreter"
        )

        # Google Places API. Sem chave, a fonte aparece como indisponível e
        # nenhuma requisição é feita — não existe modo "de mentira".
        self.google_maps_api_key: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
        self.places_url: str = os.getenv(
            "LM_PLACES_URL", "https://places.googleapis.com/v1/places:searchText"
        )

        self.config_path: Path = Path(
            os.getenv("LM_CONFIG_PATH", "data/config.json")
        )
        if not self.config_path.is_absolute():
            self.config_path = BASE_DIR / self.config_path

    @property
    def database_url(self) -> str:
        return f"sqlite:///{self.db_path}"

    def tem_chave_places(self) -> bool:
        return bool(self.google_maps_api_key.strip())

    def tem_chave_ia(self) -> bool:
        """Fase 3. Sem chave, a análise por IA fica desativada — nunca inventada."""
        return bool(os.getenv("ANTHROPIC_API_KEY") or os.getenv("OPENAI_API_KEY"))


settings = Settings()


def configurar_logs() -> None:
    logging.basicConfig(
        level=getattr(logging, settings.log_level, logging.INFO),
        format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    )


# --------------------------------------------------------------------------
# Configuração editável (pesos do score + nichos)
# --------------------------------------------------------------------------

# Somando os positivos dá exatamente 100 — a escala foi desenhada assim.
PESOS_PADRAO: dict[str, int] = {
    "sem_site_confirmado": 30,
    "muitas_avaliacoes": 15,
    "boa_nota": 10,
    "tem_telefone": 10,
    "tem_instagram": 10,
    "categoria_alto_ticket": 10,
    "presenca_digital_fraca": 10,
    "empresa_ativa": 5,
    "site_profissional": -30,
    "negocio_inativo": -20,
    "poucas_informacoes": -10,
}

LIMIARES_PADRAO: dict[str, float] = {
    # nº de avaliações acima do qual vale "muitas_avaliacoes"
    "avaliacoes_muitas": 50,
    # nota a partir da qual vale "boa_nota" (comparação >=)
    "nota_boa": 4.5,
    # nº máximo de canais digitais para considerar a presença fraca
    "canais_presenca_fraca": 1,
    # nº mínimo de campos preenchidos para o cadastro não ser "pouca informação"
    "campos_minimos": 3,
}

FAIXAS_PADRAO: list[dict[str, Any]] = [
    {"nome": "HOT", "min": 80, "max": 100},
    {"nome": "WARM", "min": 60, "max": 79},
    {"nome": "COLD", "min": 40, "max": 59},
    {"nome": "LOW", "min": 0, "max": 39},
]

_lock = threading.Lock()
_cache_config: dict[str, Any] | None = None


def config_padrao() -> dict[str, Any]:
    from app.lead_scoring.niches import NICHOS_PADRAO

    return {
        "pesos": dict(PESOS_PADRAO),
        "limiares": dict(LIMIARES_PADRAO),
        "faixas": [dict(f) for f in FAIXAS_PADRAO],
        "nichos": [dict(n) for n in NICHOS_PADRAO],
    }


def carregar_config(forcar: bool = False) -> dict[str, Any]:
    """Lê data/config.json, criando-o com os padrões na primeira execução."""
    global _cache_config
    with _lock:
        if _cache_config is not None and not forcar:
            return _cache_config
        caminho = settings.config_path
        if caminho.exists():
            try:
                dados = json.loads(caminho.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError):
                logging.getLogger(__name__).warning(
                    "config.json ilegível; voltando aos padrões", exc_info=True
                )
                dados = config_padrao()
        else:
            dados = config_padrao()
            caminho.parent.mkdir(parents=True, exist_ok=True)
            caminho.write_text(
                json.dumps(dados, ensure_ascii=False, indent=2), encoding="utf-8"
            )
        # completa chaves que faltarem (config antiga + versão nova do app)
        padrao = config_padrao()
        for chave, valor in padrao.items():
            if chave not in dados:
                dados[chave] = valor
        for chave in ("pesos", "limiares"):
            for k, v in padrao[chave].items():
                dados[chave].setdefault(k, v)
        _cache_config = dados
        return dados


def salvar_config(dados: dict[str, Any]) -> dict[str, Any]:
    global _cache_config
    with _lock:
        settings.config_path.parent.mkdir(parents=True, exist_ok=True)
        settings.config_path.write_text(
            json.dumps(dados, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        _cache_config = dados
        return dados


def limpar_cache_config() -> None:
    global _cache_config
    with _lock:
        _cache_config = None
