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


def test_cadastro_vazio_dispara_as_tres_penalidades():
    lead = {"nome_empresa": "Empresa Fantasma", "categoria": "barbearia"}
    aplicadas = {r.regra for r in calcular_score(lead).regras if r.aplicado}
    assert {"presenca_digital_fraca", "poucas_informacoes", "negocio_inativo"} <= aplicadas


def test_empresa_com_horario_publicado_conta_como_ativa():
    lead = {"nome_empresa": "Barbearia X", "horario": "Ter a Sáb 09h-20h"}
    regras = {r.regra: r for r in calcular_score(lead).regras}
    assert regras["empresa_ativa"].aplicado
    assert not regras["negocio_inativo"].aplicado
