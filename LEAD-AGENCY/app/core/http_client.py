"""Cliente HTTP com timeout, retry, rate limit por host e cache.

Só é usado para verificar o site do próprio lead. Duas regras nortearam o
código: identificar-se com um User-Agent honesto e nunca bater no mesmo host
mais rápido que o intervalo configurado.
"""

from __future__ import annotations

import logging
import socket
import threading
import time
from dataclasses import dataclass, field
from urllib.parse import urljoin, urlparse

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass
class Resposta:
    """Resultado de uma tentativa de acesso. `erro` preenchido = não respondeu.

    `tipo_falha` separa dois mundos que o texto do erro esconde:

    * `"dns"`  — o domínio não resolve. Isso é evidência: o endereço não
      existe, e quem chamou pode concluir algo a partir disso.
    * `"rede"` — nós é que não conseguimos sair (proxy, timeout, conexão
      recusada, sem rota). Isso **não** é evidência sobre o destino, e
      concluir qualquer coisa a partir daí é inventar dado.
    """

    url: str
    status: int | None = None
    url_final: str | None = None
    texto: str = ""
    erro: str | None = None
    tipo_falha: str | None = None
    tamanho: int = 0
    do_cache: bool = False

    @property
    def ok(self) -> bool:
        return self.status is not None and 200 <= self.status < 400

    @property
    def falha_nossa(self) -> bool:
        """A falha foi do nosso lado — não dá para concluir nada do destino."""
        return self.tipo_falha == "rede"


@dataclass
class _Entrada:
    resposta: Resposta
    expira_em: float


def classificar_falha(excecao: Exception) -> str:
    """"dns" quando o domínio não resolve; "rede" para todo o resto.

    Só a primeira é evidência sobre o destino. Timeout, proxy, conexão
    recusada e falta de rota falam de nós, não da empresa.
    """
    if isinstance(excecao, httpx.ProxyError):
        return "rede"
    if isinstance(excecao, httpx.TimeoutException):
        return "rede"
    if isinstance(excecao, httpx.ConnectError):
        causa: BaseException | None = excecao
        for _ in range(5):  # a cadeia de causas é curta; o limite evita ciclo
            if causa is None:
                break
            if isinstance(causa, socket.gaierror):
                return "dns"
            causa = causa.__cause__ or causa.__context__
        texto = str(excecao).lower()
        marcas = (
            "name or service not known", "nodename nor servname",
            "temporary failure in name resolution", "getaddrinfo",
            "no address associated with hostname",
        )
        if any(marca in texto for marca in marcas):
            return "dns"
    return "rede"


class _RateLimiter:
    """Um intervalo mínimo entre requisições, por host."""

    def __init__(self, intervalo: float) -> None:
        self.intervalo = intervalo
        self._ultimo: dict[str, float] = {}
        self._lock = threading.Lock()

    def aguardar(self, host: str) -> None:
        if self.intervalo <= 0:
            return
        with self._lock:
            agora = time.monotonic()
            proximo = self._ultimo.get(host, 0.0) + self.intervalo
            espera = proximo - agora
            if espera > 0:
                time.sleep(espera)
                agora = time.monotonic()
            self._ultimo[host] = agora


@dataclass
class ClienteHTTP:
    timeout: float = field(default_factory=lambda: settings.http_timeout)
    tentativas: int = field(default_factory=lambda: settings.http_retries)
    cache_min: float = field(default_factory=lambda: settings.http_cache_min)
    user_agent: str = field(default_factory=lambda: settings.user_agent)
    intervalo_host: float = field(default_factory=lambda: settings.http_intervalo_host)
    max_bytes: int = 200_000

    def __post_init__(self) -> None:
        self._cache: dict[str, _Entrada] = {}
        self._lock = threading.Lock()
        self._limiter = _RateLimiter(self.intervalo_host)

    # -- cache -------------------------------------------------------------
    def _do_cache(self, url: str) -> Resposta | None:
        with self._lock:
            entrada = self._cache.get(url)
            if entrada and entrada.expira_em > time.monotonic():
                copia = Resposta(**{**entrada.resposta.__dict__})
                copia.do_cache = True
                return copia
            if entrada:
                del self._cache[url]
        return None

    def _guardar(self, url: str, resposta: Resposta) -> None:
        with self._lock:
            self._cache[url] = _Entrada(resposta, time.monotonic() + self.cache_min * 60)

    def limpar_cache(self) -> None:
        with self._lock:
            self._cache.clear()

    # -- acesso ------------------------------------------------------------
    def obter(self, url: str, limite_bytes: int | None = None, aceita: str | None = None) -> Resposta:
        """GET com retry exponencial. Nunca levanta exceção de rede.

        `limite_bytes` sobe o corte do corpo (a resposta de uma API vem
        inteira; a home de um site a gente só precisa espiar).
        """
        limite = limite_bytes or self.max_bytes
        em_cache = self._do_cache(url)
        if em_cache is not None:
            logger.debug("cache: %s", url)
            return em_cache

        host = urlparse(url).hostname or url
        erro = "não foi possível acessar"
        tipo_falha = "rede"
        for tentativa in range(1, max(1, self.tentativas) + 1):
            self._limiter.aguardar(host)
            try:
                with httpx.Client(
                    timeout=self.timeout,
                    follow_redirects=True,
                    headers={
                        "User-Agent": self.user_agent,
                        "Accept": aceita or "text/html,application/xhtml+xml",
                    },
                    verify=True,
                ) as cliente:
                    resposta = cliente.get(url)
                    texto = resposta.text[:limite] if resposta.text else ""
                    resultado = Resposta(
                        url=url,
                        status=resposta.status_code,
                        url_final=str(resposta.url),
                        texto=texto,
                        tamanho=len(resposta.content or b""),
                    )
                    self._guardar(url, resultado)
                    return resultado
            except httpx.HTTPError as exc:
                erro = f"{type(exc).__name__}: {exc}"
                tipo_falha = classificar_falha(exc)
                logger.info("falha ao acessar %s (tentativa %s): %s", url, tentativa, erro)
                if tentativa < self.tentativas:
                    time.sleep(min(2 ** (tentativa - 1), 8))
            except Exception as exc:  # pragma: no cover - defensivo
                erro = f"erro inesperado: {exc}"
                tipo_falha = "rede"
                logger.warning("erro inesperado em %s: %s", url, exc)
                break

        resultado = Resposta(url=url, erro=erro, tipo_falha=tipo_falha)
        self._guardar(url, resultado)
        return resultado

    def robots_permite(self, url: str) -> bool:
        """Consulta o robots.txt do host antes de ler a home page.

        Em caso de dúvida (robots inacessível), liberamos: a requisição é uma
        única leitura da home, no mesmo volume de um visitante comum.
        """
        from urllib.robotparser import RobotFileParser

        partes = urlparse(url)
        if not partes.scheme or not partes.netloc:
            return True
        robots_url = urljoin(f"{partes.scheme}://{partes.netloc}", "/robots.txt")
        resposta = self.obter(robots_url)
        if not resposta.ok or not resposta.texto:
            return True
        leitor = RobotFileParser()
        leitor.parse(resposta.texto.splitlines())
        try:
            return leitor.can_fetch(self.user_agent, url)
        except Exception:  # pragma: no cover - robots malformado
            return True


cliente_http = ClienteHTTP()
