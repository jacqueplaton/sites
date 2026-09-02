"""Configuração editável, seeds e robustez do cliente HTTP."""

import time

import pytest

from app.core.config import carregar_config
from app.core.http_client import ClienteHTTP
from app.seeds import semear


def test_seeds_populam_a_base_sem_rede(cliente, db):
    resultado = semear(db)
    assert resultado["criados"] == 18 and resultado["duplicados"] == 0
    dados = cliente.get("/api/dashboard").json()
    assert dados["total_leads"] == 18
    assert dados["sem_site"] > 0 and dados["hot"] > 0


def test_seeds_nao_duplicam_na_segunda_execucao(db):
    semear(db)
    assert semear(db)["ja_havia_dados"] == 1
    assert semear(db, forcar=True)["duplicados"] == 18


def test_alterar_peso_recalcula_a_base(cliente, db):
    semear(db)
    antes = cliente.get("/api/leads", params={"ordenar": "-score"}).json()["itens"][0]

    config = carregar_config()
    config["pesos"]["sem_site_confirmado"] = 0
    resposta = cliente.put("/api/config", json={
        "pesos": config["pesos"], "limiares": config["limiares"],
        "faixas": config["faixas"], "nichos": config["nichos"],
    })
    assert resposta.status_code == 200
    assert resposta.json()["leads_recalculados"] == 18

    depois = cliente.get(f"/api/leads/{antes['id']}").json()
    assert depois["score"] == antes["score"] - 30


def test_config_incompleta_e_recusada(cliente):
    assert cliente.put("/api/config", json={
        "pesos": {"tem_telefone": 10}, "limiares": {}, "faixas": [], "nichos": [],
    }).status_code == 422


def test_restaurar_padroes(cliente, db):
    semear(db)
    config = carregar_config()
    config["pesos"]["tem_telefone"] = 99
    cliente.put("/api/config", json={
        "pesos": config["pesos"], "limiares": config["limiares"],
        "faixas": config["faixas"], "nichos": config["nichos"],
    })
    restaurado = cliente.post("/api/config/restaurar").json()
    assert restaurado["pesos"]["tem_telefone"] == 10


def test_config_nao_expoe_chave_de_api(cliente):
    corpo = cliente.get("/api/config").json()
    texto = str(corpo).lower()
    assert "api_key" not in texto and "sk-" not in texto
    assert corpo["ia_disponivel"] is False


def test_saude_responde(cliente):
    dados = cliente.get("/api/saude").json()
    assert dados["status"] == "ok" and dados["ia_disponivel"] is False


# --- cliente HTTP ---------------------------------------------------------

class _RespostaFalsa:
    def __init__(self, status=200, texto="ok", url="https://x.example.com"):
        self.status_code = status
        self.text = texto
        self.content = texto.encode()
        self.url = url


def test_cliente_http_repete_e_desiste(monkeypatch):
    import httpx

    chamadas = []

    class ClientFalso:
        def __init__(self, **kwargs):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def get(self, url):
            chamadas.append(url)
            raise httpx.ConnectError("sem rota")

    monkeypatch.setattr(httpx, "Client", ClientFalso)
    monkeypatch.setattr(time, "sleep", lambda _s: None)

    cliente = ClienteHTTP(tentativas=3, intervalo_host=0, cache_min=0)
    resposta = cliente.obter("https://indisponivel.example.com")
    assert len(chamadas) == 3
    assert not resposta.ok and "ConnectError" in resposta.erro


def test_cliente_http_usa_cache(monkeypatch):
    import httpx

    chamadas = []

    class ClientFalso:
        def __init__(self, **kwargs):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def get(self, url):
            chamadas.append(url)
            return _RespostaFalsa(url=url)

    monkeypatch.setattr(httpx, "Client", ClientFalso)
    cliente = ClienteHTTP(tentativas=1, intervalo_host=0, cache_min=10)
    cliente.obter("https://x.example.com")
    segunda = cliente.obter("https://x.example.com")
    assert len(chamadas) == 1 and segunda.do_cache is True


def test_rate_limit_espaca_requisicoes_ao_mesmo_host(monkeypatch):
    import httpx

    class ClientFalso:
        def __init__(self, **kwargs):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def get(self, url):
            return _RespostaFalsa(url=url)

    monkeypatch.setattr(httpx, "Client", ClientFalso)
    cliente = ClienteHTTP(tentativas=1, intervalo_host=0.15, cache_min=0)
    inicio = time.monotonic()
    cliente.obter("https://x.example.com/a")
    cliente.obter("https://x.example.com/b")
    assert time.monotonic() - inicio >= 0.15


def test_robots_bloqueado_e_respeitado(monkeypatch):
    import httpx

    class ClientFalso:
        def __init__(self, **kwargs):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def get(self, url):
            if url.endswith("robots.txt"):
                return _RespostaFalsa(texto="User-agent: *\nDisallow: /", url=url)
            return _RespostaFalsa(url=url)

    monkeypatch.setattr(httpx, "Client", ClientFalso)
    cliente = ClienteHTTP(tentativas=1, intervalo_host=0, cache_min=0)
    assert cliente.robots_permite("https://x.example.com/") is False


# --- classificação da falha ------------------------------------------------

def test_classificar_falha_separa_dns_de_rede():
    """Só "o domínio não resolve" é evidência sobre o destino."""
    import socket

    import httpx

    from app.core.http_client import classificar_falha

    assert classificar_falha(httpx.ProxyError("403 Forbidden")) == "rede"
    assert classificar_falha(httpx.ConnectTimeout("estourou")) == "rede"
    assert classificar_falha(httpx.ReadTimeout("estourou")) == "rede"
    assert classificar_falha(httpx.ConnectError("Connection refused")) == "rede"

    por_causa = httpx.ConnectError("falhou")
    por_causa.__cause__ = socket.gaierror(-2, "Name or service not known")
    assert classificar_falha(por_causa) == "dns"
    assert classificar_falha(
        httpx.ConnectError("[Errno -2] Name or service not known")
    ) == "dns"


def test_resposta_de_falha_carrega_o_tipo(monkeypatch):
    import httpx

    class ClientFalso:
        def __init__(self, **kwargs):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def get(self, url):
            raise httpx.ProxyError("403 Forbidden")

    monkeypatch.setattr(httpx, "Client", ClientFalso)
    resposta = ClienteHTTP(tentativas=1, intervalo_host=0, cache_min=0).obter(
        "https://bloqueado.example.com"
    )
    assert resposta.tipo_falha == "rede"
    assert resposta.falha_nossa is True
