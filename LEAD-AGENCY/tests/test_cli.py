"""Comandos de terminal.

Nenhum teste aqui sai para a rede: o comando de coleta recebe uma fonte de
fixture, e a qualificação roda com --sem-verificar-site.
"""

import json

import pytest

from app.cli import gravar_dossie, main
from app.core.config import BASE_DIR
from app.crm import crud
from app.crm.models import Lead, StatusLead

LEAD = {
    "nome_empresa": "Clínica Odonto Aurora", "categoria": "dentista",
    "cidade": "Campinas", "estado": "SP", "telefone": "(19) 5555-0101",
    "instagram": "@odontoaurora", "avaliacao": 4.8, "qtd_avaliacoes": 143,
    "horario": "Seg a Sex 08h-18h",
}


@pytest.fixture(autouse=True)
def leads_limpos():
    """Limpa os dossiês antes e depois: eles são derivados, não fixtures."""
    def limpar():
        for pasta in ("novos", "qualificados", "abordados", "clientes"):
            destino = BASE_DIR / "leads" / pasta
            if destino.exists():
                for arquivo in destino.glob("*.json"):
                    arquivo.unlink()
    limpar()
    yield
    limpar()


def test_dashboard_roda_com_base_vazia(capsys):
    assert main(["dashboard"]) == 0
    saida = capsys.readouterr().out
    assert "LEAD AGENCY" in saida and "Leads encontrados" in saida


def test_dashboard_formata_reais_no_padrao_brasileiro(capsys, db):
    crud.criar_lead(db, {**LEAD, "status": StatusLead.FECHADO, "valor_proposta": 4500.0})
    main(["dashboard"])
    assert "R$ 4.500,00" in capsys.readouterr().out


def test_qualificar_pontua_e_promove(capsys, db):
    crud.criar_lead(db, LEAD)
    assert main(["qualificar", "--sem-verificar-site", "--corte", "60"]) == 0
    saida = capsys.readouterr().out
    assert "1 promovido(s) a QUALIFICADO" in saida
    db.expire_all()
    assert db.execute(__import__("sqlalchemy").select(Lead)).scalar_one().status == "QUALIFICADO"


def test_qualificar_sem_verificacao_nao_marca_sem_site(capsys, db):
    crud.criar_lead(db, LEAD)
    main(["qualificar", "--sem-verificar-site"])
    db.expire_all()
    lead = db.execute(__import__("sqlalchemy").select(Lead)).scalar_one()
    assert lead.site_situacao == "SITE_NAO_CONFIRMADO"
    assert lead.website_status == "NAO_VERIFICADO"


def test_qualificar_com_base_vazia_nao_quebra(capsys):
    assert main(["qualificar", "--sem-verificar-site"]) == 0
    assert "Nenhum lead NOVO" in capsys.readouterr().out


def test_criar_site_recusa_e_explica(capsys, db):
    lead = crud.criar_lead(db, LEAD)
    assert main(["criar-site", str(lead.id)]) == 1
    saida = capsys.readouterr().out
    assert "Fase 4" in saida and "não vai criar uma pasta pela metade" in saida


def test_criar_site_de_lead_inexistente(capsys):
    assert main(["criar-site", "999"]) == 2
    assert "não existe" in capsys.readouterr().out


def test_dossie_segue_o_lead_de_pasta(db):
    lead = crud.criar_lead(db, LEAD)
    caminho = gravar_dossie(lead)
    assert caminho.parent.name == "novos"
    assert json.loads(caminho.read_text(encoding="utf-8"))["nome_empresa"] == LEAD["nome_empresa"]

    lead.status = StatusLead.QUALIFICADO
    novo = gravar_dossie(lead)
    assert novo.parent.name == "qualificados"
    assert not caminho.exists(), "o dossiê antigo tem de sair da pasta anterior"

    lead.status = StatusLead.FECHADO
    assert gravar_dossie(lead).parent.name == "clientes"


def test_dossie_nao_vaza_chave_de_deduplicacao(db):
    lead = crud.criar_lead(db, LEAD)
    dados = json.loads(gravar_dossie(lead).read_text(encoding="utf-8"))
    assert not [c for c in dados if c.startswith("chave_")]


def test_prospectar_grava_o_que_a_fonte_devolve(capsys, monkeypatch, db):
    from app.prospecting.fontes import ResultadoBusca
    import app.cli as cli

    class FonteFalsa:
        nome = "fixture"

        def buscar(self, _parametros):
            return ResultadoBusca(
                leads=[dict(LEAD), {**LEAD, "nome_empresa": "Odonto Central",
                                    "telefone": "(19) 5555-0202"}],
                encontrados=2, avisos=["fonte de teste"],
            )

    monkeypatch.setattr(cli, "fonte_por_nome", lambda _n: FonteFalsa(), raising=False)
    monkeypatch.setattr("app.prospecting.fontes.fonte_por_nome", lambda _n: FonteFalsa())

    codigo = main(["prospectar", "--city", "Campinas", "--niche", "dentista", "--sim"])
    assert codigo == 0
    saida = capsys.readouterr().out
    assert "2 novos" in saida and "fonte de teste" in saida
    assert len(list((BASE_DIR / "leads" / "novos").glob("*.json"))) == 2


def test_prospectar_bloqueia_duplicado_da_propria_fonte(capsys, monkeypatch, db):
    from app.prospecting.fontes import ResultadoBusca

    class FonteRepetida:
        nome = "fixture"

        def buscar(self, _parametros):
            return ResultadoBusca(leads=[dict(LEAD), dict(LEAD)], encontrados=2)

    monkeypatch.setattr("app.prospecting.fontes.fonte_por_nome", lambda _n: FonteRepetida())
    main(["prospectar", "--city", "Campinas", "--niche", "dentista", "--sim"])
    assert "1 novos · 1 duplicados bloqueados" in capsys.readouterr().out


def test_fonte_inexistente_devolve_codigo_de_erro(capsys):
    assert main(["prospectar", "--city", "X", "--niche", "dentista",
                 "--source", "maps_raspado", "--sim"]) == 2
    assert "não existe" in capsys.readouterr().out
