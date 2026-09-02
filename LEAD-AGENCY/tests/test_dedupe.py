"""Deduplicação: a mesma empresa não entra duas vezes."""

import pytest

from app.crm.crud import criar_lead
from app.lead_scoring.dedupe import (
    LeadDuplicadoError,
    encontrar_duplicata,
    extrair_dominio,
    normalizar_endereco,
    normalizar_nome,
    normalizar_telefone,
)

BASE = {
    "nome_empresa": "Clínica Odonto Aurora",
    "cidade": "Campinas",
    "endereco": "Rua das Palmeiras, 120",
    "telefone": "(19) 5555-0101",
    "website": "https://odontoaurora.example.com",
    "google_maps_url": "https://maps.example.com/lugar/odonto-aurora",
}


def test_normalizadores():
    assert normalizar_nome("Odonto Aurora LTDA") == "odonto aurora"
    assert normalizar_telefone("+55 (19) 5555-0101") == "1955550101"
    assert normalizar_telefone("123") == ""
    assert extrair_dominio("https://WWW.Exemplo.com.br/contato") == "exemplo.com.br"
    assert extrair_dominio("https://instagram.com/empresa") == ""
    assert normalizar_endereco("Avenida Brasil, 100") == normalizar_endereco("Av. Brasil 100")


def test_mesma_url_do_maps_bloqueia(db):
    criar_lead(db, dict(BASE))
    with pytest.raises(LeadDuplicadoError) as erro:
        criar_lead(db, {**BASE, "nome_empresa": "Outro nome completamente diferente"})
    assert "Google Maps" in erro.value.duplicata.motivo


def test_mesmo_telefone_bloqueia(db):
    criar_lead(db, dict(BASE))
    with pytest.raises(LeadDuplicadoError) as erro:
        criar_lead(db, {
            "nome_empresa": "Consultório Aurora",
            "telefone": "19 5555 0101",
            "cidade": "Campinas",
        })
    assert "telefone" in erro.value.duplicata.motivo


def test_mesmo_dominio_bloqueia(db):
    criar_lead(db, dict(BASE))
    with pytest.raises(LeadDuplicadoError):
        criar_lead(db, {
            "nome_empresa": "Aurora Odontologia",
            "website": "http://www.odontoaurora.example.com/agendar",
        })


def test_nome_parecido_mesma_cidade_e_endereco(db):
    criar_lead(db, {k: v for k, v in BASE.items() if k not in {"telefone", "google_maps_url", "website"}})
    with pytest.raises(LeadDuplicadoError) as erro:
        criar_lead(db, {
            "nome_empresa": "Clinica Odonto Aurora ME",
            "cidade": "Campinas",
            "endereco": "R. das Palmeiras 120",
        })
    assert erro.value.duplicata.similaridade >= 0.87


def test_empresa_parecida_em_outra_cidade_entra(db):
    criar_lead(db, {"nome_empresa": "Barbearia Dom Vito", "cidade": "Campinas"})
    lead = criar_lead(db, {"nome_empresa": "Barbearia Dom Vito", "cidade": "Sorocaba"})
    assert lead.id is not None


def test_nomes_diferentes_nao_sao_duplicata(db):
    criar_lead(db, {"nome_empresa": "Padaria do Zé", "cidade": "Campinas"})
    assert encontrar_duplicata(db, {"nome_empresa": "Auto Center Turbo", "cidade": "Campinas"}) is None


def test_atualizacao_nao_colide_com_ele_mesmo(db):
    lead = criar_lead(db, dict(BASE))
    assert encontrar_duplicata(db, BASE, ignorar_id=lead.id) is None


def test_nome_identico_sem_endereco_nem_telefone_e_bloqueado(db):
    """Sem endereço e sem telefone dos dois lados, não há como distinguir."""
    criar_lead(db, {"nome_empresa": "Personal Trainer Rafael Costa", "cidade": "Campinas"})
    with pytest.raises(LeadDuplicadoError) as erro:
        criar_lead(db, {"nome_empresa": "Personal Trainer Rafael Costa", "cidade": "Campinas"})
    assert "sem endereço ou telefone" in erro.value.duplicata.motivo


def test_enderecos_diferentes_na_mesma_cidade_nao_sao_duplicata(db):
    """Duas unidades da mesma rede continuam sendo dois leads."""
    criar_lead(db, {"nome_empresa": "Barbearia Dom Vito", "cidade": "Campinas",
                    "endereco": "Rua do Comércio, 45"})
    lead = criar_lead(db, {"nome_empresa": "Barbearia Dom Vito", "cidade": "Campinas",
                           "endereco": "Avenida Independência, 2200"})
    assert lead.id is not None
