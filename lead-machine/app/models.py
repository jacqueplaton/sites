"""Modelo de dados.

Um lead é uma empresa local coletada de uma fonte permitida. Além dos campos
do briefing, guardamos o resultado das duas rotinas automáticas — detector de
site e score — com a justificativa de cada uma, para que nenhum número
apareça na tela sem explicação.
"""

from __future__ import annotations

from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import DateTime, Float, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def agora() -> datetime:
    return datetime.now(timezone.utc)


class StatusLead(StrEnum):
    NOVO = "NOVO"
    QUALIFICADO = "QUALIFICADO"
    ABORDADO = "ABORDADO"
    RESPONDEU = "RESPONDEU"
    INTERESSADO = "INTERESSADO"
    REUNIAO = "REUNIAO"
    PROPOSTA = "PROPOSTA"
    NEGOCIACAO = "NEGOCIACAO"
    FECHADO = "FECHADO"
    PERDIDO = "PERDIDO"
    NAO_INTERESSADO = "NAO_INTERESSADO"


class SituacaoSite(StrEnum):
    SEM_SITE = "SEM_SITE"
    TEM_SITE = "TEM_SITE"
    SITE_NAO_CONFIRMADO = "SITE_NAO_CONFIRMADO"


class StatusWebsite(StrEnum):
    CONFIRMADO = "CONFIRMADO"
    NAO_ENCONTRADO = "NAO_ENCONTRADO"
    INVALIDO = "INVALIDO"
    NAO_VERIFICADO = "NAO_VERIFICADO"


class Faixa(StrEnum):
    HOT = "HOT"
    WARM = "WARM"
    COLD = "COLD"
    LOW = "LOW"


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # --- identificação ----------------------------------------------------
    nome_empresa: Mapped[str] = mapped_column(String(255), nullable=False)
    categoria: Mapped[str | None] = mapped_column(String(120))
    subcategoria: Mapped[str | None] = mapped_column(String(120))

    # --- localização ------------------------------------------------------
    cidade: Mapped[str | None] = mapped_column(String(120))
    estado: Mapped[str | None] = mapped_column(String(60))
    pais: Mapped[str | None] = mapped_column(String(60), default="Brasil")
    endereco: Mapped[str | None] = mapped_column(String(300))

    # --- contato e presença digital --------------------------------------
    telefone: Mapped[str | None] = mapped_column(String(60))
    website: Mapped[str | None] = mapped_column(String(300))
    instagram: Mapped[str | None] = mapped_column(String(300))
    facebook: Mapped[str | None] = mapped_column(String(300))
    google_maps_url: Mapped[str | None] = mapped_column(String(500))

    # --- reputação --------------------------------------------------------
    avaliacao: Mapped[float | None] = mapped_column(Float)
    qtd_avaliacoes: Mapped[int | None] = mapped_column(Integer)
    horario: Mapped[str | None] = mapped_column(String(300))
    descricao: Mapped[str | None] = mapped_column(Text)

    # --- origem e acompanhamento -----------------------------------------
    fonte: Mapped[str | None] = mapped_column(String(120))
    data_coleta: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=agora)
    status: Mapped[str] = mapped_column(String(30), default=StatusLead.NOVO, index=True)
    score: Mapped[int] = mapped_column(Integer, default=0, index=True)
    observacoes: Mapped[str | None] = mapped_column(Text)

    # --- resultado do detector de site ------------------------------------
    site_situacao: Mapped[str] = mapped_column(
        String(30), default=SituacaoSite.SITE_NAO_CONFIRMADO, index=True
    )
    website_status: Mapped[str] = mapped_column(
        String(30), default=StatusWebsite.NAO_VERIFICADO, index=True
    )
    website_confianca: Mapped[float] = mapped_column(Float, default=0.0)
    website_url_verificada: Mapped[str | None] = mapped_column(String(300))
    website_evidencia: Mapped[str | None] = mapped_column(Text)
    website_verificado_em: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # --- resultado do score -----------------------------------------------
    faixa: Mapped[str] = mapped_column(String(10), default=Faixa.LOW, index=True)
    score_detalhe: Mapped[str | None] = mapped_column(Text)

    # --- CRM (preenchido na fase 4; colunas já existem para evitar migração)
    proxima_acao: Mapped[str | None] = mapped_column(String(300))
    proxima_acao_em: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    valor_proposta: Mapped[float | None] = mapped_column(Float)
    motivo_perda: Mapped[str | None] = mapped_column(String(300))
    tipo_abordagem: Mapped[str | None] = mapped_column(String(60))

    # --- chaves normalizadas usadas na deduplicação -----------------------
    chave_nome: Mapped[str | None] = mapped_column(String(255), index=True)
    chave_telefone: Mapped[str | None] = mapped_column(String(30), index=True)
    chave_dominio: Mapped[str | None] = mapped_column(String(180), index=True)
    chave_endereco: Mapped[str | None] = mapped_column(String(300))
    chave_maps: Mapped[str | None] = mapped_column(String(500), index=True)

    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=agora)
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=agora, onupdate=agora
    )


Index("ix_leads_cidade_categoria", Lead.cidade, Lead.categoria)
