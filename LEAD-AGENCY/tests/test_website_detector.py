"""detect_missing_website(): nunca concluir 'sem site' sem verificação."""

from tests.conftest import pagina
from app.core.http_client import Resposta
from app.crm.models import SituacaoSite, StatusWebsite
from app.lead_scoring.website_detector import detect_missing_website


def test_campo_ausente_sem_verificacao_fica_nao_confirmado(cliente_falso):
    resultado = detect_missing_website(
        {"nome_empresa": "Barbearia Dom Vito", "website": None},
        cliente=cliente_falso(), buscar_dominio=False,
    )
    assert resultado.site_situacao == SituacaoSite.SITE_NAO_CONFIRMADO
    assert resultado.website_status == StatusWebsite.NAO_VERIFICADO
    assert resultado.confianca == 0.0
    assert "não trouxe o campo website" in " ".join(resultado.evidencia)


def test_site_no_ar_e_confirmado(cliente_falso):
    url = "https://odontoaurora.example.com"
    cli = cliente_falso({url: Resposta(url=url, status=200, url_final=url,
                                       texto=pagina("Clínica Odonto Aurora"))})
    resultado = detect_missing_website({"nome_empresa": "Clínica Odonto Aurora", "website": url}, cli)
    assert resultado.site_situacao == SituacaoSite.TEM_SITE
    assert resultado.website_status == StatusWebsite.CONFIRMADO
    assert resultado.confianca >= 0.95
    assert resultado.url_verificada == url


def test_dominio_que_nao_resolve_fica_invalido(cliente_falso):
    resultado = detect_missing_website(
        {"nome_empresa": "Empresa X", "website": "https://naoresponde.example.com"},
        cliente_falso(tipo_falha_padrao="dns"),
    )
    assert resultado.site_situacao == SituacaoSite.SITE_NAO_CONFIRMADO
    assert resultado.website_status == StatusWebsite.INVALIDO


def test_rede_fora_nao_torna_o_site_invalido(cliente_falso):
    """Se a falha foi nossa, o site pode estar perfeitamente no ar."""
    resultado = detect_missing_website(
        {"nome_empresa": "Empresa X", "website": "https://existe.example.com"},
        cliente_falso(tipo_falha_padrao="rede"),
    )
    assert resultado.site_situacao == SituacaoSite.SITE_NAO_CONFIRMADO
    assert resultado.website_status == StatusWebsite.NAO_VERIFICADO
    assert resultado.confianca == 0.0
    assert "a falha foi nossa" in " ".join(resultado.evidencia)


def test_http_404_fica_invalido(cliente_falso):
    url = "https://quebrado.example.com"
    cli = cliente_falso({url: Resposta(url=url, status=404, url_final=url, texto="não encontrado")})
    resultado = detect_missing_website({"nome_empresa": "Empresa X", "website": url}, cli)
    assert resultado.website_status == StatusWebsite.INVALIDO


def test_dominio_estacionado_nao_conta_como_site(cliente_falso):
    url = "https://parked.example.com"
    cli = cliente_falso({url: Resposta(url=url, status=200, url_final=url,
                                       texto=pagina("Domínio", "<p>This domain is for sale</p>"))})
    resultado = detect_missing_website({"nome_empresa": "Empresa X", "website": url}, cli)
    assert resultado.site_situacao == SituacaoSite.SITE_NAO_CONFIRMADO
    assert resultado.website_status == StatusWebsite.INVALIDO


def test_link_de_rede_social_nao_e_site(cliente_falso):
    resultado = detect_missing_website(
        {"nome_empresa": "Studio Bella", "website": "https://instagram.com/studiobella"},
        cliente_falso(),
    )
    assert resultado.website_status == StatusWebsite.INVALIDO
    assert "rede social" in " ".join(resultado.evidencia)


def test_url_malformada_e_invalida(cliente_falso):
    resultado = detect_missing_website({"nome_empresa": "X", "website": "isso não é url"},
                                       cliente_falso())
    assert resultado.website_status == StatusWebsite.INVALIDO


def test_robots_bloqueado_nao_conclui(cliente_falso):
    url = "https://bloqueado.example.com"
    cli = cliente_falso({url: Resposta(url=url, status=200, url_final=url, texto=pagina("X"))},
                        robots=False)
    resultado = detect_missing_website({"nome_empresa": "X", "website": url}, cli)
    assert resultado.website_status == StatusWebsite.NAO_VERIFICADO


def test_candidatos_que_nao_resolvem_concluem_sem_site(cliente_falso):
    """Só aqui SEM_SITE é permitido: os domínios foram testados e não existem."""
    resultado = detect_missing_website(
        {"nome_empresa": "Padaria Estrela", "website": None},
        cliente_falso(tipo_falha_padrao="dns"), buscar_dominio=True,
    )
    assert resultado.site_situacao == SituacaoSite.SEM_SITE
    assert resultado.website_status == StatusWebsite.NAO_ENCONTRADO
    assert "nenhum resolve" in " ".join(resultado.evidencia)


def test_sem_rede_nunca_conclui_sem_site(cliente_falso):
    """O erro que este teste tranca.

    Rodando a qualificação com a saída de rede bloqueada, o detector
    interpretava "não consegui sair" como "os domínios não existem" e marcava
    a empresa como SEM_SITE — inventando a evidência que sustenta +30 no score
    e joga o lead para HOT. Falha nossa não é evidência sobre ninguém.
    """
    resultado = detect_missing_website(
        {"nome_empresa": "Academia Corpo em Movimento", "website": None},
        cliente_falso(tipo_falha_padrao="rede"), buscar_dominio=True,
    )
    assert resultado.site_situacao == SituacaoSite.SITE_NAO_CONFIRMADO
    assert resultado.website_status == StatusWebsite.NAO_VERIFICADO
    assert resultado.confianca == 0.0
    assert "a falha foi nossa" in " ".join(resultado.evidencia)


def test_dominio_candidato_que_responde_e_cita_a_empresa(cliente_falso):
    url = "https://padariaestrela.com.br"
    cli = cliente_falso({url: Resposta(url=url, status=200, url_final=url,
                                       texto=pagina("Padaria Estrela"))})
    resultado = detect_missing_website(
        {"nome_empresa": "Padaria Estrela", "website": None}, cli, buscar_dominio=True
    )
    assert resultado.site_situacao == SituacaoSite.TEM_SITE
    assert resultado.confianca < 0.95  # domínio adivinhado vale menos que o informado


def test_dominio_candidato_de_outra_empresa_e_inconclusivo(cliente_falso):
    url = "https://padariaestrela.com.br"
    cli = cliente_falso({url: Resposta(url=url, status=200, url_final=url,
                                       texto=pagina("Consultoria Financeira Delta"))})
    resultado = detect_missing_website(
        {"nome_empresa": "Padaria Estrela", "website": None}, cli, buscar_dominio=True
    )
    assert resultado.site_situacao == SituacaoSite.SITE_NAO_CONFIRMADO
    assert resultado.website_status == StatusWebsite.NAO_VERIFICADO
