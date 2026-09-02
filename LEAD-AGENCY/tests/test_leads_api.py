"""Cadastro, filtros, status e auditoria pela API."""

import pytest

from app.crm.crud import criar_lead
from app.crm.models import SituacaoSite, StatusWebsite

LEAD = {
    "nome_empresa": "Clínica Odonto Aurora",
    "categoria": "dentista",
    "cidade": "Campinas",
    "estado": "SP",
    "telefone": "(19) 5555-0101",
    "instagram": "@odontoaurora",
    "avaliacao": 4.8,
    "qtd_avaliacoes": 143,
}


def test_criar_e_ler_lead(cliente):
    resposta = cliente.post("/api/leads", json=LEAD)
    assert resposta.status_code == 201
    criado = resposta.json()
    assert criado["nome_empresa"] == LEAD["nome_empresa"]
    assert criado["status"] == "NOVO"
    # sem verificação, a situação do site fica indefinida — nunca "sem site"
    assert criado["site_situacao"] == "SITE_NAO_CONFIRMADO"
    assert criado["website_status"] == "NAO_VERIFICADO"
    assert criado["score_detalhe"]

    detalhe = cliente.get(f"/api/leads/{criado['id']}").json()
    assert detalhe["id"] == criado["id"]


def test_criar_duplicado_devolve_409(cliente):
    cliente.post("/api/leads", json=LEAD)
    repetido = cliente.post("/api/leads", json={**LEAD, "nome_empresa": "Odonto Aurora Clínica"})
    assert repetido.status_code == 409
    assert repetido.json()["detail"]["duplicata"]["motivo"].startswith("mesmo telefone")


def test_checar_duplicata_sem_gravar(cliente):
    cliente.post("/api/leads", json=LEAD)
    resposta = cliente.post("/api/leads/checar-duplicata", json=LEAD)
    assert resposta.json()["lead_id"] == 1
    assert cliente.get("/api/leads").json()["total"] == 1


def test_nome_curto_e_rejeitado(cliente):
    assert cliente.post("/api/leads", json={"nome_empresa": "X"}).status_code == 422


def test_atualizar_e_excluir(cliente):
    lead_id = cliente.post("/api/leads", json=LEAD).json()["id"]
    atualizado = cliente.put(f"/api/leads/{lead_id}", json={"cidade": "Valinhos"}).json()
    assert atualizado["cidade"] == "Valinhos"
    assert cliente.delete(f"/api/leads/{lead_id}").status_code == 204
    assert cliente.get(f"/api/leads/{lead_id}").status_code == 404


def test_mudanca_de_status_registra_observacao(cliente):
    lead_id = cliente.post("/api/leads", json=LEAD).json()["id"]
    resposta = cliente.post(
        f"/api/leads/{lead_id}/status",
        json={"status": "ABORDADO", "observacao": "mensagem enviada pelo vendedor"},
    ).json()
    assert resposta["status"] == "ABORDADO"
    assert "mensagem enviada pelo vendedor" in resposta["observacoes"]


def test_status_invalido_e_rejeitado(cliente):
    lead_id = cliente.post("/api/leads", json=LEAD).json()["id"]
    assert cliente.post(f"/api/leads/{lead_id}/status", json={"status": "INVENTADO"}).status_code == 422


def test_auditoria_traz_blocos_obrigatorios(cliente, db):
    lead = criar_lead(db, {
        **LEAD,
        "site_situacao": SituacaoSite.SEM_SITE,
        "website_status": StatusWebsite.NAO_ENCONTRADO,
    })
    auditoria = cliente.get(f"/api/leads/{lead.id}/auditoria").json()
    assert auditoria["por_que_interessante"]
    assert auditoria["oportunidades"]
    assert auditoria["presenca_digital"]
    assert auditoria["score_detalhe"]
    servicos = [o["servico"] for o in auditoria["oportunidades"]]
    assert "Site institucional" in servicos
    # sem chave de IA configurada, nenhum texto de IA é inventado
    assert auditoria["analise_ia"]["disponivel"] is False


def test_auditoria_de_lead_sem_dados_diz_nao_identificado(cliente):
    lead_id = cliente.post("/api/leads", json={"nome_empresa": "Empresa Sem Dados"}).json()["id"]
    auditoria = cliente.get(f"/api/leads/{lead_id}/auditoria").json()
    valores = [p["valor"] for p in auditoria["presenca_digital"]]
    assert "não identificado" in valores
    assert auditoria["nicho"] is None


def test_paginas_html_respondem(cliente):
    for caminho in ("/", "/buscar", "/leads", "/crm", "/auditoria", "/configuracoes"):
        assert cliente.get(caminho).status_code == 200, caminho


def test_auditoria_de_lead_inexistente_da_404(cliente):
    assert cliente.get("/auditoria/999").status_code == 404
