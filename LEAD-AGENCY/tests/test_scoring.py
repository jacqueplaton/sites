"""Score: pesos, faixas, limites e configurabilidade."""

from app.core.config import carregar_config, salvar_config
from app.crm.models import SituacaoSite, StatusWebsite
from app.lead_scoring.scoring import calcular_score

LEAD_HOT = {
    "categoria": "dentista",
    "telefone": "(19) 5555-0101",
    "instagram": "@odontoaurora",
    "endereco": "Rua das Palmeiras, 120",
    "horario": "Seg a Sex",
    "avaliacao": 4.8,
    "qtd_avaliacoes": 143,
    "site_situacao": SituacaoSite.SEM_SITE,
    "website_status": StatusWebsite.NAO_ENCONTRADO,
}


def test_lead_ideal_cai_na_faixa_hot():
    resultado = calcular_score(LEAD_HOT)
    # 30 sem site + 15 avaliações + 10 nota + 10 telefone + 10 instagram
    # + 10 alto ticket + 10 presença fraca + 5 empresa ativa = 100
    assert resultado.score == 100
    assert resultado.faixa == "HOT"


def test_positivos_somam_exatamente_cem():
    """A escala do Módulo 4 foi desenhada para fechar em 100."""
    from app.core.config import carregar_config

    pesos = carregar_config()["pesos"]
    assert sum(peso for peso in pesos.values() if peso > 0) == 100


def test_sem_site_so_pontua_quando_confirmado():
    lead = {**LEAD_HOT, "site_situacao": SituacaoSite.SITE_NAO_CONFIRMADO,
            "website_status": StatusWebsite.NAO_VERIFICADO}
    regra = next(r for r in calcular_score(lead).regras if r.regra == "sem_site_confirmado")
    assert not regra.aplicado


def test_site_profissional_desconta():
    com_site = {**LEAD_HOT, "site_situacao": SituacaoSite.TEM_SITE,
                "website_status": StatusWebsite.CONFIRMADO, "website": "https://x.example.com"}
    resultado = calcular_score(com_site)
    aplicadas = {r.regra for r in resultado.regras if r.aplicado}
    assert "site_profissional" in aplicadas
    assert "sem_site_confirmado" not in aplicadas
    # perde os 30 do "sem site", leva -30 e deixa de ter presença digital fraca
    assert resultado.score == calcular_score(LEAD_HOT).score - 30 - 30 - 10


def test_lead_vazio_nao_fica_negativo():
    resultado = calcular_score({"nome_empresa": "Empresa Sem Dados"})
    assert resultado.score == 0
    assert resultado.faixa == "LOW"


def test_score_nunca_passa_de_100():
    config = carregar_config()
    config["pesos"]["sem_site_confirmado"] = 200
    assert calcular_score(LEAD_HOT, config).score == 100


def test_toda_regra_traz_justificativa():
    for regra in calcular_score(LEAD_HOT).regras:
        assert regra.motivo, f"regra {regra.regra} sem motivo"
        assert regra.descricao


def test_faixas_cobrem_todos_os_limites():
    faixas = [(0, "LOW"), (39, "LOW"), (40, "COLD"), (59, "COLD"),
              (60, "WARM"), (79, "WARM"), (80, "HOT"), (100, "HOT")]
    from app.lead_scoring.scoring import faixa_do_score
    config = carregar_config()
    for valor, esperada in faixas:
        assert faixa_do_score(valor, config["faixas"]) == esperada


def test_pesos_configuraveis_mudam_o_score():
    base = calcular_score(LEAD_HOT).score
    config = carregar_config()
    config["pesos"]["tem_instagram"] = 0
    salvar_config(config)
    assert calcular_score(LEAD_HOT, config).score == base - 10


def test_nicho_desconhecido_nao_ganha_alto_ticket():
    lead = {**LEAD_HOT, "categoria": "loja de aquário"}
    regra = next(r for r in calcular_score(lead).regras if r.regra == "categoria_alto_ticket")
    assert not regra.aplicado
    assert regra.motivo == "nicho não identificado"


def test_cadastro_vazio_dispara_as_penalidades():
    """Sem avaliações informadas, 'inativo' não dispara — só as outras duas."""
    lead = {"nome_empresa": "Empresa Fantasma", "categoria": "barbearia"}
    aplicadas = {r.regra for r in calcular_score(lead).regras if r.aplicado}
    assert {"presenca_digital_fraca", "poucas_informacoes"} <= aplicadas
    assert "negocio_inativo" not in aplicadas

    confirmado = {**lead, "qtd_avaliacoes": 0}
    aplicadas = {r.regra for r in calcular_score(confirmado).regras if r.aplicado}
    assert "negocio_inativo" in aplicadas


def test_empresa_com_horario_publicado_conta_como_ativa():
    lead = {"nome_empresa": "Barbearia X", "horario": "Ter a Sáb 09h-20h"}
    regras = {r.regra: r for r in calcular_score(lead).regras}
    assert regras["empresa_ativa"].aplicado
    assert not regras["negocio_inativo"].aplicado


def test_fonte_sem_avaliacoes_nao_vira_negocio_inativo():
    """None é 'não informado'; 0 é 'não tem'. Só o segundo penaliza.

    O OpenStreetMap nunca traz avaliação. Tratar isso como zero puniria o
    lead pela limitação da fonte — o mesmo erro que o detector de site evita
    ao não concluir SEM_SITE por campo vazio.
    """
    do_osm = {"nome_empresa": "Consultório X", "categoria": "dentista",
              "telefone": "(84) 5555-0001", "endereco": "Rua Teste, 100"}
    regra = next(r for r in calcular_score(do_osm).regras if r.regra == "negocio_inativo")
    assert not regra.aplicado
    assert "não informou avaliações" in regra.motivo


def test_zero_avaliacoes_informado_penaliza():
    conhecido = {"nome_empresa": "Consultório Y", "categoria": "dentista",
                 "telefone": "(84) 5555-0002", "endereco": "Rua Teste, 200",
                 "qtd_avaliacoes": 0}
    regra = next(r for r in calcular_score(conhecido).regras if r.regra == "negocio_inativo")
    assert regra.aplicado
