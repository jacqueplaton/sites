"""CRM (status/funil) e métricas do dashboard."""

import pytest

from app.crm.crud import criar_lead
from app.crm.models import SituacaoSite, StatusLead, StatusWebsite


@pytest.fixture
def base(db):
    def novo(nome, **extra):
        return criar_lead(db, {"nome_empresa": nome, "cidade": "Campinas",
                               "categoria": "dentista", **extra})

    novo("Lead Novo A")
    novo("Lead Novo B", site_situacao=SituacaoSite.SEM_SITE,
         website_status=StatusWebsite.NAO_ENCONTRADO, qtd_avaliacoes=90,
         avaliacao=4.9, telefone="(19) 5555-0001", instagram="@b")
    novo("Lead Abordado", status=StatusLead.ABORDADO, tipo_abordagem="whatsapp",
         telefone="(19) 5555-0002")
    novo("Lead Respondeu", status=StatusLead.RESPONDEU, tipo_abordagem="whatsapp",
         telefone="(19) 5555-0003")
    novo("Lead Fechado", status=StatusLead.FECHADO, tipo_abordagem="instagram",
         valor_proposta=4000.0, telefone="(19) 5555-0004")
    novo("Lead Perdido", status=StatusLead.PERDIDO, motivo_perda="sem verba",
         tipo_abordagem="telefone", telefone="(19) 5555-0005", cidade="Sorocaba")
    return db


def test_dashboard_conta_o_funil(cliente, base):
    dados = cliente.get("/api/dashboard").json()
    assert dados["total_leads"] == 6
    assert dados["sem_site"] == 1
    assert dados["abordados"] == 4          # abordado, respondeu, fechado, perdido
    assert dados["respostas"] == 2          # respondeu, fechado
    assert dados["vendas"] == 1
    assert dados["valor_vendido"] == 4000.0
    assert dados["ticket_medio"] == 4000.0


def test_dashboard_calcula_taxas(cliente, base):
    dados = cliente.get("/api/dashboard").json()
    assert dados["taxa_resposta"] == 50.0       # 2 respostas / 4 abordados
    assert dados["taxa_conversao"] == pytest.approx(16.7, abs=0.1)


def test_dashboard_quebra_por_nicho_cidade_e_abordagem(cliente, base):
    dados = cliente.get("/api/dashboard").json()
    assert dados["por_nicho"][0]["chave"] == "dentista"
    cidades = {c["chave"]: c["leads"] for c in dados["por_cidade"]}
    assert cidades == {"Campinas": 5, "Sorocaba": 1}
    abordagens = {a["chave"]: a["leads"] for a in dados["por_abordagem"]}
    assert abordagens["whatsapp"] == 2 and abordagens["não registrada"] == 2


def test_dashboard_respeita_filtro(cliente, base):
    dados = cliente.get("/api/dashboard", params={"cidade": "Sorocaba"}).json()
    assert dados["total_leads"] == 1


def test_dashboard_de_base_vazia_nao_quebra(cliente):
    dados = cliente.get("/api/dashboard").json()
    assert dados["total_leads"] == 0
    assert dados["taxa_resposta"] == 0.0 and dados["ticket_medio"] == 0.0


def test_lead_percorre_todo_o_funil(cliente, base):
    lead_id = cliente.get("/api/leads", params={"q": "Lead Novo A"}).json()["itens"][0]["id"]
    for status in ("QUALIFICADO", "ABORDADO", "RESPONDEU", "INTERESSADO", "REUNIAO",
                   "PROPOSTA", "NEGOCIACAO", "FECHADO"):
        resposta = cliente.post(f"/api/leads/{lead_id}/status", json={"status": status})
        assert resposta.status_code == 200 and resposta.json()["status"] == status


def test_valor_e_motivo_de_perda_persistem(cliente, base):
    lead_id = cliente.get("/api/leads", params={"q": "Lead Novo A"}).json()["itens"][0]["id"]
    atualizado = cliente.put(f"/api/leads/{lead_id}", json={
        "status": "PERDIDO", "motivo_perda": "escolheu concorrente",
        "valor_proposta": 2500.0, "proxima_acao": "retomar em 90 dias",
    }).json()
    assert atualizado["motivo_perda"] == "escolheu concorrente"
    assert atualizado["valor_proposta"] == 2500.0
    assert atualizado["proxima_acao"] == "retomar em 90 dias"


def test_opcoes_alimentam_os_filtros(cliente, base):
    opcoes = cliente.get("/api/opcoes").json()
    assert len(opcoes["status"]) == 13
    assert "SITE_CRIADO" in opcoes["status"] and "ABORDAR" in opcoes["status"]
    assert "Campinas" in opcoes["cidades"] and "dentista" in opcoes["categorias"]
