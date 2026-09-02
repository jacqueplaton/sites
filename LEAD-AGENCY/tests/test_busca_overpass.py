"""Coleta no OpenStreetMap.

A chamada de rede real não roda na suíte: as respostas do Nominatim e da
Overpass são fixtures no formato documentado de cada API. O que estes testes
cobrem é a montagem da consulta, a conversão para Lead, os filtros, os avisos
e a integração com dedupe/score.
"""

import json

import pytest

from app.prospecting.fontes import ParametrosBusca
from app.prospecting.overpass import URL_NOMINATIM, URL_OVERPASS, FonteOverpass
from app.core.http_client import Resposta

NOMINATIM = json.dumps([{"lat": "-22.9056", "lon": "-47.0608",
                         "display_name": "Campinas, São Paulo, Brasil"}])

OVERPASS = json.dumps({
    "elements": [
        {
            "type": "node", "id": 1, "lat": -22.90, "lon": -47.06,
            "tags": {
                "name": "Clínica Odonto Aurora", "amenity": "dentist",
                "phone": "+55 19 5555-0101", "addr:street": "Rua das Palmeiras",
                "addr:housenumber": "120", "addr:city": "Campinas",
                "opening_hours": "Mo-Fr 08:00-18:00",
            },
        },
        {
            "type": "way", "id": 2, "center": {"lat": -22.91, "lon": -47.07},
            "tags": {
                "name": "Odontologia Central", "amenity": "dentist",
                "website": "https://odontocentral.example.com",
                "contact:instagram": "@odontocentral",
            },
        },
        {
            "type": "node", "id": 3, "lat": -22.92, "lon": -47.05,
            "tags": {"name": "Consultório Sorriso", "amenity": "dentist"},
        },
        # sem nome: não serve para prospectar, tem de ser ignorado
        {"type": "node", "id": 4, "lat": -22.93, "lon": -47.04,
         "tags": {"amenity": "dentist"}},
    ]
})


class ClienteDeFixture:
    def __init__(self, nominatim=NOMINATIM, overpass=OVERPASS):
        self.nominatim = nominatim
        self.overpass = overpass
        self.urls: list[str] = []

    def obter(self, url, limite_bytes=None, aceita=None):
        self.urls.append(url)
        if url.startswith(URL_NOMINATIM):
            return Resposta(url=url, status=200, url_final=url, texto=self.nominatim)
        if url.startswith(URL_OVERPASS):
            return Resposta(url=url, status=200, url_final=url, texto=self.overpass)
        return Resposta(url=url, erro="fixture não cobre esta URL")

    def robots_permite(self, url):
        return True


@pytest.fixture
def parametros():
    return ParametrosBusca(cidade="Campinas", estado="SP", nicho="dentista", quantidade=10)


def test_consulta_overpass_tem_a_forma_documentada():
    consulta = FonteOverpass().montar_consulta(['["amenity"="dentist"]'], -22.9, -47.06, 5000)
    assert consulta.startswith("[out:json][timeout:60];(")
    assert 'node["amenity"="dentist"](around:5000,-22.9,-47.06);' in consulta
    assert 'way["amenity"="dentist"](around:5000,-22.9,-47.06);' in consulta
    assert consulta.endswith(");out center;")


def test_busca_converte_elementos_em_leads(parametros):
    resultado = FonteOverpass(ClienteDeFixture()).buscar(parametros)
    assert resultado.erro is None
    assert resultado.encontrados == 4
    assert len(resultado.leads) == 3          # o elemento sem nome fica de fora

    primeiro = resultado.leads[0]
    assert primeiro["nome_empresa"] == "Clínica Odonto Aurora"
    assert primeiro["telefone"] == "+55 19 5555-0101"
    assert primeiro["endereco"] == "Rua das Palmeiras 120"
    assert primeiro["categoria"] == "dentista"
    assert primeiro["fonte"] == "openstreetmap"
    assert "openstreetmap.org/node/1" in primeiro["observacoes"]


def test_nao_inventa_nota_nem_avaliacoes(parametros):
    """O OSM não tem esses campos — o app deixa vazio em vez de estimar."""
    for lead in FonteOverpass(ClienteDeFixture()).buscar(parametros).leads:
        assert "avaliacao" not in lead and "qtd_avaliacoes" not in lead


def test_toggle_so_sem_site(parametros):
    parametros.so_sem_site = True
    resultado = FonteOverpass(ClienteDeFixture()).buscar(parametros)
    nomes = [lead["nome_empresa"] for lead in resultado.leads]
    assert "Odontologia Central" not in nomes
    assert resultado.descartados_por_filtro == 1


def test_toggle_so_com_telefone(parametros):
    parametros.so_com_telefone = True
    resultado = FonteOverpass(ClienteDeFixture()).buscar(parametros)
    assert [lead["nome_empresa"] for lead in resultado.leads] == ["Clínica Odonto Aurora"]


def test_quantidade_limita_o_retorno(parametros):
    parametros.quantidade = 2
    assert len(FonteOverpass(ClienteDeFixture()).buscar(parametros).leads) == 2


def test_avisa_que_filtros_de_reputacao_nao_se_aplicam(parametros):
    parametros.avaliacao_min = 4.5
    parametros.avaliacoes_min = 20
    avisos = " ".join(FonteOverpass(ClienteDeFixture()).buscar(parametros).avisos)
    assert "não traz nota" in avisos
    assert "OpenStreetMap" in avisos and "ODbL" in avisos


def test_nicho_sem_etiqueta_no_osm_para_a_busca(parametros):
    parametros.nicho = "padaria"
    resultado = FonteOverpass(ClienteDeFixture()).buscar(parametros)
    assert resultado.erro and "não tem etiqueta confiável" in resultado.erro
    assert resultado.leads == []


def test_cidade_desconhecida_no_nominatim_para_a_busca(parametros):
    resultado = FonteOverpass(ClienteDeFixture(nominatim="[]")).buscar(parametros)
    assert resultado.erro and "não conhece" in resultado.erro


def test_nominatim_inacessivel_diz_que_e_conexao_e_nao_cidade_errada(parametros):
    """Rede bloqueada e cidade inexistente são erros diferentes na tela."""

    class SemRede(ClienteDeFixture):
        def obter(self, url, limite_bytes=None, aceita=None):
            return Resposta(url=url, erro="ProxyError: 403 Forbidden")

    resultado = FonteOverpass(SemRede()).buscar(parametros)
    assert resultado.erro and "não consegui falar com o Nominatim" in resultado.erro
    assert "bloqueados" in resultado.erro


def test_overpass_fora_do_ar_nao_quebra(parametros):
    class Offline(ClienteDeFixture):
        def obter(self, url, limite_bytes=None, aceita=None):
            if url.startswith(URL_NOMINATIM):
                return Resposta(url=url, status=200, url_final=url, texto=NOMINATIM)
            return Resposta(url=url, erro="ConnectError: sem rota")

    resultado = FonteOverpass(Offline()).buscar(parametros)
    assert resultado.erro and "Overpass não respondeu" in resultado.erro


def test_resposta_que_nao_e_json_nao_quebra(parametros):
    resultado = FonteOverpass(ClienteDeFixture(overpass="<html>erro 429</html>")).buscar(parametros)
    assert resultado.erro and "não é JSON" in resultado.erro


# -- integração com a rota --------------------------------------------------

@pytest.fixture
def fonte_de_fixture(monkeypatch):
    import app.prospecting.fontes as fontes

    monkeypatch.setattr(fontes, "fonte_por_nome", lambda _nome: FonteOverpass(ClienteDeFixture()))
    import app.routers.busca as rota

    monkeypatch.setattr(rota, "fonte_por_nome", lambda _nome: FonteOverpass(ClienteDeFixture()))


def test_rota_de_busca_grava_com_score_e_sem_verificar_site(cliente, fonte_de_fixture):
    resposta = cliente.post("/api/busca", json={"cidade": "Campinas", "nicho": "dentista"})
    assert resposta.status_code == 200
    dados = resposta.json()
    assert dados["novos"] == 3 and dados["duplicados"] == 0
    for lead in dados["leads"]:
        assert lead["status"] == "NOVO"
        # coleta não conclui nada sobre site: isso é papel do detector, depois
        assert lead["website_status"] == "NAO_VERIFICADO"
        assert lead["site_situacao"] == "SITE_NAO_CONFIRMADO"
        assert lead["score"] >= 0


def test_buscar_duas_vezes_nao_duplica(cliente, fonte_de_fixture):
    cliente.post("/api/busca", json={"cidade": "Campinas", "nicho": "dentista"})
    segunda = cliente.post("/api/busca", json={"cidade": "Campinas", "nicho": "dentista"}).json()
    assert segunda["novos"] == 0 and segunda["duplicados"] == 3
    assert cliente.get("/api/leads").json()["total"] == 3


def test_fonte_inexistente_e_recusada(cliente):
    assert cliente.post(
        "/api/busca", json={"cidade": "Campinas", "nicho": "dentista", "fonte": "google_maps_raspado"}
    ).status_code == 422


def test_places_api_aparece_como_indisponivel(cliente):
    fontes = {f["id"]: f for f in cliente.get("/api/busca/fontes").json()}
    assert fontes["openstreetmap"]["disponivel"] is True
    assert fontes["google_places"]["disponivel"] is False
    assert "chave própria" in fontes["google_places"]["limitacao"]
