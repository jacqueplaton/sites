"""Seeds fictícios.

Empresas inventadas, telefones no bloco reservado para ficção (5555-xxxx) e
domínios em example.com — nada aqui corresponde a negócio real. Servem para
rodar o app e a suíte de testes sem tocar em nenhuma plataforma externa.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crm.crud import criar_lead
from app.lead_scoring.dedupe import LeadDuplicadoError
from app.crm.models import Lead, SituacaoSite, StatusLead, StatusWebsite

logger = logging.getLogger(__name__)

LEADS_FICTICIOS: list[dict[str, Any]] = [
    {
        "nome_empresa": "Clínica Odonto Aurora", "categoria": "dentista",
        "cidade": "Campinas", "estado": "SP", "endereco": "Rua das Palmeiras, 120",
        "telefone": "(19) 5555-0101", "instagram": "@odontoaurora",
        "google_maps_url": "https://maps.example.com/lugar/odonto-aurora",
        "avaliacao": 4.8, "qtd_avaliacoes": 143, "horario": "Seg a Sex 08h-18h",
        "descricao": "Clínica odontológica com foco em ortodontia.",
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6,
        "website_evidencia": "domínios candidatos testados sem resposta: clinicaodontoaurora.com.br",
    },
    {
        "nome_empresa": "Advocacia Ribeiro & Associados", "categoria": "advocacia",
        "cidade": "Campinas", "estado": "SP", "endereco": "Av. Central, 900, sala 12",
        "telefone": "(19) 5555-0202", "instagram": "@ribeiroadv",
        "google_maps_url": "https://maps.example.com/lugar/ribeiro-adv",
        "avaliacao": 4.9, "qtd_avaliacoes": 62, "horario": "Seg a Sex 09h-18h",
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
        "status": StatusLead.QUALIFICADO,
    },
    {
        "nome_empresa": "Barbearia Dom Vito", "categoria": "barbearia",
        "cidade": "Campinas", "estado": "SP", "endereco": "Rua do Comércio, 45",
        "telefone": "(19) 5555-0303", "instagram": "@domvitobarber",
        "avaliacao": 4.7, "qtd_avaliacoes": 210, "horario": "Ter a Sáb 09h-20h",
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
    },
    {
        "nome_empresa": "Studio Bella Estética", "categoria": "estetica",
        "cidade": "Valinhos", "estado": "SP", "endereco": "Rua das Acácias, 77",
        "telefone": "(19) 5555-0404", "instagram": "@studiobellaestetica",
        "facebook": "https://facebook.example.com/studiobella",
        "avaliacao": 4.6, "qtd_avaliacoes": 88,
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
        "status": StatusLead.ABORDADO, "tipo_abordagem": "whatsapp",
    },
    {
        "nome_empresa": "Imobiliária Horizonte", "categoria": "imobiliaria",
        "cidade": "Campinas", "estado": "SP", "endereco": "Av. Brasil, 1500",
        "telefone": "(19) 5555-0505", "website": "https://horizonte.example.com",
        "instagram": "@imobhorizonte", "avaliacao": 4.3, "qtd_avaliacoes": 51,
        "site_situacao": SituacaoSite.TEM_SITE, "website_status": StatusWebsite.CONFIRMADO,
        "website_confianca": 0.95, "website_url_verificada": "https://horizonte.example.com",
        "website_evidencia": "HTTP 200 | a página menciona o nome da empresa",
    },
    {
        "nome_empresa": "Academia Corpo em Movimento", "categoria": "academia",
        "cidade": "Valinhos", "estado": "SP", "endereco": "Rua Sete de Abril, 300",
        "telefone": "(19) 5555-0606", "instagram": "@corpoemmovimento",
        "avaliacao": 4.4, "qtd_avaliacoes": 320, "horario": "Seg a Sáb 06h-22h",
        "site_situacao": SituacaoSite.SITE_NAO_CONFIRMADO,
        "website_status": StatusWebsite.NAO_VERIFICADO, "website_confianca": 0.0,
        "website_evidencia": "a fonte não trouxe o campo website",
    },
    {
        "nome_empresa": "Oficina do Zé Mecânica", "categoria": "oficina",
        "cidade": "Sumaré", "estado": "SP", "endereco": "Rua dos Ferreiros, 88",
        "telefone": "(19) 5555-0707", "avaliacao": 4.1, "qtd_avaliacoes": 34,
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
    },
    {
        "nome_empresa": "Contabilidade Nova Era", "categoria": "contador",
        "cidade": "Campinas", "estado": "SP", "endereco": "Rua XV, 210, conjunto 3",
        "telefone": "(19) 5555-0808", "website": "http://novaera.example.com",
        "avaliacao": 4.9, "qtd_avaliacoes": 27,
        "site_situacao": SituacaoSite.SITE_NAO_CONFIRMADO,
        "website_status": StatusWebsite.INVALIDO, "website_confianca": 0.6,
        "website_evidencia": "HTTP 200 | página parece estacionada/em construção ('em construção')",
        "status": StatusLead.INTERESSADO, "tipo_abordagem": "email",
    },
    {
        "nome_empresa": "Restaurante Sabor da Serra", "categoria": "restaurante",
        "cidade": "Vinhedo", "estado": "SP", "endereco": "Estrada da Serra, km 4",
        "telefone": "(19) 5555-0909", "instagram": "@sabordaserra",
        "avaliacao": 4.5, "qtd_avaliacoes": 402, "horario": "Qui a Dom 11h-16h",
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
        "status": StatusLead.PROPOSTA, "valor_proposta": 3800.0, "tipo_abordagem": "whatsapp",
    },
    {
        "nome_empresa": "Nutri Vida Consultório", "categoria": "nutricionista",
        "cidade": "Vinhedo", "estado": "SP", "telefone": "(19) 5555-1010",
        "instagram": "@nutrividaconsultorio", "avaliacao": 5.0, "qtd_avaliacoes": 12,
        "site_situacao": SituacaoSite.SITE_NAO_CONFIRMADO,
        "website_status": StatusWebsite.NAO_VERIFICADO, "website_confianca": 0.0,
        "website_evidencia": "a fonte não trouxe o campo website",
    },
    {
        "nome_empresa": "Arquitetura Traço Fino", "categoria": "arquiteto",
        "cidade": "Campinas", "estado": "SP", "endereco": "Rua dos Ipês, 15",
        "telefone": "(19) 5555-1111", "instagram": "@tracofinoarq",
        "avaliacao": 4.8, "qtd_avaliacoes": 41,
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
        "status": StatusLead.FECHADO, "valor_proposta": 4500.0, "tipo_abordagem": "instagram",
    },
    {
        "nome_empresa": "Fisio Movimento Clínica", "categoria": "fisioterapeuta",
        "cidade": "Sumaré", "estado": "SP", "endereco": "Av. das Nações, 501",
        "telefone": "(19) 5555-1212", "avaliacao": 4.2, "qtd_avaliacoes": 19,
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
        "status": StatusLead.NAO_INTERESSADO, "tipo_abordagem": "telefone",
    },
    {
        "nome_empresa": "Salão Encanto & Cia", "categoria": "salao",
        "cidade": "Valinhos", "estado": "SP", "endereco": "Rua Marechal, 62",
        "telefone": "(19) 5555-1313", "instagram": "@salaoencanto",
        "avaliacao": 4.6, "qtd_avaliacoes": 155,
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
        "status": StatusLead.RESPONDEU, "tipo_abordagem": "whatsapp",
    },
    {
        "nome_empresa": "Auto Center Turbo Pneus", "categoria": "auto_center",
        "cidade": "Sumaré", "estado": "SP", "endereco": "Rod. dos Bandeirantes, km 12",
        "telefone": "(19) 5555-1414", "website": "https://turbopneus.example.com",
        "avaliacao": 3.9, "qtd_avaliacoes": 76,
        "site_situacao": SituacaoSite.TEM_SITE, "website_status": StatusWebsite.CONFIRMADO,
        "website_confianca": 0.95, "website_url_verificada": "https://turbopneus.example.com",
        "website_evidencia": "HTTP 200",
    },
    {
        "nome_empresa": "Personal Trainer Rafael Costa", "categoria": "personal",
        "cidade": "Campinas", "estado": "SP", "instagram": "@rafaelcostatreina",
        "avaliacao": None, "qtd_avaliacoes": 0,
        "site_situacao": SituacaoSite.SITE_NAO_CONFIRMADO,
        "website_status": StatusWebsite.NAO_VERIFICADO, "website_confianca": 0.0,
        "website_evidencia": "a fonte não trouxe o campo website",
    },
    {
        "nome_empresa": "Clínica Vida Plena", "categoria": "clinica",
        "cidade": "Vinhedo", "estado": "SP", "endereco": "Rua da Saúde, 800",
        "telefone": "(19) 5555-1515", "instagram": "@clinicavidaplena",
        "avaliacao": 4.7, "qtd_avaliacoes": 96, "horario": "Seg a Sex 07h-19h",
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
        "status": StatusLead.REUNIAO, "tipo_abordagem": "whatsapp",
    },
    {
        "nome_empresa": "Barbearia Navalha de Ouro", "categoria": "barbearia",
        "cidade": "Vinhedo", "estado": "SP", "endereco": "Rua Bela Vista, 9",
        "telefone": "(19) 5555-1616", "avaliacao": 4.0, "qtd_avaliacoes": 8,
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
        "status": StatusLead.PERDIDO, "motivo_perda": "sem verba no momento",
        "tipo_abordagem": "telefone",
    },
    {
        "nome_empresa": "Estética Renova Você", "categoria": "estetica",
        "cidade": "Campinas", "estado": "SP", "endereco": "Rua Aurora, 33",
        "telefone": "(19) 5555-1717", "instagram": "@renovavoce",
        "avaliacao": 4.9, "qtd_avaliacoes": 64,
        "site_situacao": SituacaoSite.SEM_SITE, "website_status": StatusWebsite.NAO_ENCONTRADO,
        "website_confianca": 0.6, "website_evidencia": "sem domínio ativo localizado",
        "status": StatusLead.NEGOCIACAO, "valor_proposta": 3200.0, "tipo_abordagem": "instagram",
    },
]


def semear(db: Session, forcar: bool = False) -> dict[str, int]:
    """Insere os leads fictícios. Sem `forcar`, não faz nada se a base tiver dados."""
    existentes = db.execute(select(Lead.id)).first()
    if existentes and not forcar:
        return {"criados": 0, "duplicados": 0, "ja_havia_dados": 1}

    criados = duplicados = 0
    base = datetime.now(timezone.utc)
    for indice, dados in enumerate(LEADS_FICTICIOS):
        registro = dict(dados)
        registro.setdefault("fonte", "seed_ficticio")
        registro.setdefault("pais", "Brasil")
        registro["data_coleta"] = base - timedelta(days=indice)
        try:
            criar_lead(db, registro, verificar_site=False)
            criados += 1
        except LeadDuplicadoError as exc:
            duplicados += 1
            logger.info("seed ignorado (duplicado): %s", exc)
    return {"criados": criados, "duplicados": duplicados, "ja_havia_dados": 0}
