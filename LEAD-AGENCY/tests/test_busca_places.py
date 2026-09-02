"""Coleta na Google Places API.

Nenhum teste faz requisição: as respostas são fixtures no formato documentado
do endpoint `places:searchText`. O que se verifica é a montagem da consulta, a
conversão para Lead, os filtros, a paginação, o teto de 60 e o repasse fiel do
erro do Google.
"""

import json

import pytest

from app.core.http_client import Resposta
from app.prospecting.fontes import ParametrosBusca
from app.prospecting.places import MAXIMO_TOTAL, FontePlaces


def lugar(nome, **campos):
    base = {"id": f"place-{nome.lower().replace(' ', '-')}",
            "displayName": {"text": nome, "languageCode": "pt-BR"},
            "businessStatus": "OPERATIONAL"}
    base.update(campos)
    return base


PAGINA = {
    "places": [
        lugar("Clínica Odonto Aurora",
              formattedAddress="R. das Palmeiras, 120 - Natal, RN",
              nationalPhoneNumber="(84) 3333-1111",
              rating=4.8, userRatingCount=143,
              regularOpeningHours={"weekdayDescriptions": ["segunda-feira: 08:00–18:00"]},
              googleMapsUri="https://maps.google.com/?cid=1",
              primaryTypeDisplayName={"text": "Dentista"}),
        lugar("Odontologia Central",
              formattedAddress="Av. Central, 900 - Natal, RN",
              websiteUri="https://odontocentral.example.com",
              nationalPhoneNumber="(84) 3333-2222",
              rating=4.2, userRatingCount=18),
        lugar("Consultório Sorriso", rating=3.9, userRatingCount=5),
        lugar("Clínica Fechada", businessStatus="CLOSED_PERMANENTLY",
              rating=4.9, userRatingCount=200),
    ]
}


class ClienteDeFixture:
    def __init__(self, paginas=None, status=200):
        self.paginas = paginas if paginas is not None else [PAGINA]
        self.status = status
        self.chamadas: list[dict] = []

    def postar_json(self, url, corpo, cabecalhos=None, limite_bytes=None):
        self.chamadas.append({"url": url, "corpo": corpo, "cabecalhos": cabecalhos})
        indice = min(len(self.chamadas) - 1, len(self.paginas) - 1)
        conteudo = self.paginas[indice]
        return Resposta(url=url, status=self.status, url_final=url,
                        texto=json.dumps(conteudo))


@pytest.fixture
def parametros():
    return ParametrosBusca(cidade="Natal", estado="RN", nicho="dentista", quantidade=10)


def test_consulta_leva_cidade_estado_e_pais(parametros):
    fonte = FontePlaces(ClienteDeFixture(), chave="chave-de-teste")
    assert fonte.montar_consulta(parametros) == "dentista em Natal, RN, Brasil"


def test_sem_chave_nao_faz_requisicao(parametros):
    cliente = ClienteDeFixture()
    resultado = FontePlaces(cliente, chave="").buscar(parametros)
    assert resultado.erro and "precisa de chave própria" in resultado.erro
    assert cliente.chamadas == [], "sem chave, nenhuma requisição pode sair"


def test_cabecalhos_e_corpo_seguem_o_contrato(parametros):
    cliente = ClienteDeFixture()
    FontePlaces(cliente, chave="minha-chave").buscar(parametros)
    chamada = cliente.chamadas[0]
    assert chamada["cabecalhos"]["X-Goog-Api-Key"] == "minha-chave"
    assert "places.websiteUri" in chamada["cabecalhos"]["X-Goog-FieldMask"]
    assert "places.userRatingCount" in chamada["cabecalhos"]["X-Goog-FieldMask"]
    assert chamada["corpo"]["textQuery"] == "dentista em Natal, RN, Brasil"
    assert chamada["corpo"]["pageSize"] <= 20


def test_converte_todos_os_campos_que_o_score_usa(parametros):
    resultado = FontePlaces(ClienteDeFixture(), chave="k").buscar(parametros)
    primeiro = resultado.leads[0]
    assert primeiro["nome_empresa"] == "Clínica Odonto Aurora"
    assert primeiro["telefone"] == "(84) 3333-1111"
    assert primeiro["avaliacao"] == 4.8
    assert primeiro["qtd_avaliacoes"] == 143
    assert primeiro["google_maps_url"] == "https://maps.google.com/?cid=1"
    assert primeiro["horario"] == "segunda-feira: 08:00–18:00"
    assert primeiro["categoria"] == "dentista"
    assert primeiro["fonte"] == "google_places"


def test_negocio_fechado_em_definitivo_nao_entra(parametros):
    resultado = FontePlaces(ClienteDeFixture(), chave="k").buscar(parametros)
    assert "Clínica Fechada" not in [lead["nome_empresa"] for lead in resultado.leads]


def test_filtro_so_sem_site(parametros):
    parametros.so_sem_site = True
    resultado = FontePlaces(ClienteDeFixture(), chave="k").buscar(parametros)
    assert "Odontologia Central" not in [lead["nome_empresa"] for lead in resultado.leads]


def test_filtros_de_reputacao_funcionam_nesta_fonte(parametros):
    """O que o OpenStreetMap não permitia: filtrar por nota e nº de avaliações."""
    parametros.avaliacao_min = 4.5
    parametros.avaliacoes_min = 100
    resultado = FontePlaces(ClienteDeFixture(), chave="k").buscar(parametros)
    assert [lead["nome_empresa"] for lead in resultado.leads] == ["Clínica Odonto Aurora"]


def test_pagina_ate_a_quantidade_pedida(parametros):
    pagina1 = {"places": PAGINA["places"][:2], "nextPageToken": "abc"}
    pagina2 = {"places": [lugar("Odonto Quatro"), lugar("Odonto Cinco")]}
    cliente = ClienteDeFixture([pagina1, pagina2])
    resultado = FontePlaces(cliente, chave="k").buscar(parametros)
    assert len(cliente.chamadas) == 2
    assert cliente.chamadas[1]["corpo"]["pageToken"] == "abc"
    assert len(resultado.leads) == 4


def test_para_de_paginar_sem_token(parametros):
    cliente = ClienteDeFixture([{"places": [lugar("Único")]}])
    FontePlaces(cliente, chave="k").buscar(parametros)
    assert len(cliente.chamadas) == 1


def test_avisa_sobre_o_teto_de_60(parametros):
    parametros.quantidade = 100
    resultado = FontePlaces(ClienteDeFixture(), chave="k").buscar(parametros)
    assert any(str(MAXIMO_TOTAL) in aviso for aviso in resultado.avisos)


def test_avisa_quantas_requisicoes_foram_cobradas(parametros):
    resultado = FontePlaces(ClienteDeFixture(), chave="k").buscar(parametros)
    assert any("cobrança é por requisição" in aviso for aviso in resultado.avisos)


def test_erro_do_google_e_repassado_literalmente(parametros):
    class ClienteRecusa(ClienteDeFixture):
        def postar_json(self, url, corpo, cabecalhos=None, limite_bytes=None):
            self.chamadas.append(corpo)
            return Resposta(
                url=url, status=403, url_final=url,
                texto=json.dumps({"error": {
                    "code": 403,
                    "message": "Places API has not been used in project 123 before or it is disabled.",
                    "status": "PERMISSION_DENIED"}}),
            )

    resultado = FontePlaces(ClienteRecusa(), chave="k").buscar(parametros)
    assert "has not been used in project" in resultado.erro
    assert "403" in resultado.erro


def test_falha_de_rede_nao_vira_lista_vazia(parametros):
    class Offline(ClienteDeFixture):
        def postar_json(self, url, corpo, cabecalhos=None, limite_bytes=None):
            return Resposta(url=url, erro="ProxyError: 403 Forbidden", tipo_falha="rede")

    resultado = FontePlaces(Offline(), chave="k").buscar(parametros)
    assert resultado.erro and "não consegui falar com a Places API" in resultado.erro
    assert resultado.leads == []


def test_resposta_ilegivel_nao_quebra(parametros):
    class Bagunca(ClienteDeFixture):
        def postar_json(self, url, corpo, cabecalhos=None, limite_bytes=None):
            return Resposta(url=url, status=200, url_final=url, texto="<html>ops</html>")

    assert "não é JSON" in FontePlaces(Bagunca(), chave="k").buscar(parametros).erro


def test_fonte_aparece_disponivel_quando_ha_chave(monkeypatch):
    from app.core.config import settings
    from app.prospecting.fontes import fontes_disponiveis

    monkeypatch.setattr(settings, "google_maps_api_key", "")
    por_id = {f["id"]: f for f in fontes_disponiveis()}
    assert por_id["google_places"]["disponivel"] is False

    monkeypatch.setattr(settings, "google_maps_api_key", "uma-chave")
    por_id = {f["id"]: f for f in fontes_disponiveis()}
    assert por_id["google_places"]["disponivel"] is True
