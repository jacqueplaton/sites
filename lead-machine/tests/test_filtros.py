"""Filtros da listagem — inclusive os toggles da tela de busca."""

import pytest

from app.crud import criar_lead
from app.models import SituacaoSite, StatusWebsite


@pytest.fixture
def base(db):
    criar_lead(db, {
        "nome_empresa": "Odonto Aurora", "categoria": "dentista", "cidade": "Campinas",
        "estado": "SP", "telefone": "(19) 5555-0101", "instagram": "@aurora",
        "avaliacao": 4.9, "qtd_avaliacoes": 143,
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
    })
    criar_lead(db, {
        "nome_empresa": "Imobiliária Horizonte", "categoria": "imobiliaria",
        "cidade": "Campinas", "estado": "SP", "telefone": "(19) 5555-0505",
        "website": "https://horizonte.example.com", "avaliacao": 4.3, "qtd_avaliacoes": 51,
        "site_situacao": SituacaoSite.TEM_SITE, "website_status": StatusWebsite.CONFIRMADO,
    })
    criar_lead(db, {
        "nome_empresa": "Barbearia Dom Vito", "categoria": "barbearia", "cidade": "Sorocaba",
        "estado": "SP", "avaliacao": 3.8, "qtd_avaliacoes": 9,
    })
    return db


def total(cliente, **params):
    return cliente.get("/api/leads", params=params).json()["total"]


def test_sem_filtro_traz_tudo(cliente, base):
    assert total(cliente) == 3


def test_filtro_de_cidade(cliente, base):
    assert total(cliente, cidade="Campinas") == 2


def test_filtro_de_categoria(cliente, base):
    assert total(cliente, categoria="dentista") == 1


def test_filtro_so_sem_site(cliente, base):
    assert total(cliente, site="SEM_SITE") == 1
    assert total(cliente, site="TEM_SITE") == 1
    assert total(cliente, site="SITE_NAO_CONFIRMADO") == 1


def test_toggles_de_telefone_e_instagram(cliente, base):
    assert total(cliente, tem_telefone=True) == 2
    assert total(cliente, tem_telefone=False) == 1
    assert total(cliente, tem_instagram=True) == 1


def test_filtros_de_avaliacao(cliente, base):
    assert total(cliente, avaliacao_min=4.5) == 1
    assert total(cliente, avaliacoes_min=50) == 2


def test_filtro_por_faixa_e_score(cliente, base):
    assert total(cliente, faixa="HOT") >= 1
    assert total(cliente, score_min=0, score_max=100) == 3


def test_busca_livre(cliente, base):
    assert total(cliente, q="Barbearia") == 1
    assert total(cliente, q="não existe nada assim") == 0


def test_ordenacao_por_score(cliente, base):
    itens = cliente.get("/api/leads", params={"ordenar": "-score"}).json()["itens"]
    scores = [i["score"] for i in itens]
    assert scores == sorted(scores, reverse=True)


def test_paginacao(cliente, base):
    pagina = cliente.get("/api/leads", params={"por_pagina": 2, "pagina": 2}).json()
    assert pagina["paginas"] == 2 and len(pagina["itens"]) == 1


def test_filtros_combinados(cliente, base):
    assert total(cliente, cidade="Campinas", site="SEM_SITE", tem_telefone=True) == 1
