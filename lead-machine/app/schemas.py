"""Schemas de entrada e saída da API."""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models import Faixa, SituacaoSite, StatusLead, StatusWebsite


class LeadBase(BaseModel):
    nome_empresa: str = Field(min_length=2, max_length=255)
    categoria: str | None = Field(default=None, max_length=120)
    subcategoria: str | None = Field(default=None, max_length=120)
    cidade: str | None = Field(default=None, max_length=120)
    estado: str | None = Field(default=None, max_length=60)
    pais: str | None = Field(default="Brasil", max_length=60)
    endereco: str | None = Field(default=None, max_length=300)
    telefone: str | None = Field(default=None, max_length=60)
    website: str | None = Field(default=None, max_length=300)
    instagram: str | None = Field(default=None, max_length=300)
    facebook: str | None = Field(default=None, max_length=300)
    google_maps_url: str | None = Field(default=None, max_length=500)
    avaliacao: float | None = Field(default=None, ge=0, le=5)
    qtd_avaliacoes: int | None = Field(default=None, ge=0)
    horario: str | None = Field(default=None, max_length=300)
    descricao: str | None = None
    fonte: str | None = Field(default=None, max_length=120)
    observacoes: str | None = None

    @field_validator("*", mode="before")
    @classmethod
    def _vazio_vira_nulo(cls, valor: Any) -> Any:
        if isinstance(valor, str) and not valor.strip():
            return None
        return valor.strip() if isinstance(valor, str) else valor


class LeadCriar(LeadBase):
    status: StatusLead = StatusLead.NOVO
    data_coleta: datetime | None = None


class LeadAtualizar(BaseModel):
    model_config = ConfigDict(extra="ignore")

    nome_empresa: str | None = Field(default=None, min_length=2, max_length=255)
    categoria: str | None = None
    subcategoria: str | None = None
    cidade: str | None = None
    estado: str | None = None
    pais: str | None = None
    endereco: str | None = None
    telefone: str | None = None
    website: str | None = None
    instagram: str | None = None
    facebook: str | None = None
    google_maps_url: str | None = None
    avaliacao: float | None = Field(default=None, ge=0, le=5)
    qtd_avaliacoes: int | None = Field(default=None, ge=0)
    horario: str | None = None
    descricao: str | None = None
    fonte: str | None = None
    observacoes: str | None = None
    status: StatusLead | None = None
    proxima_acao: str | None = None
    valor_proposta: float | None = None
    motivo_perda: str | None = None
    tipo_abordagem: str | None = None


class LeadSaida(LeadBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    score: int
    faixa: str
    site_situacao: str
    website_status: str
    website_confianca: float
    website_url_verificada: str | None
    website_evidencia: str | None
    website_verificado_em: datetime | None
    data_coleta: datetime
    criado_em: datetime
    atualizado_em: datetime
    proxima_acao: str | None = None
    valor_proposta: float | None = None
    motivo_perda: str | None = None
    tipo_abordagem: str | None = None
    score_detalhe: list[dict[str, Any]] | None = None

    @field_validator("score_detalhe", mode="before")
    @classmethod
    def _detalhe_json(cls, valor: Any) -> Any:
        if isinstance(valor, str):
            try:
                return json.loads(valor)
            except json.JSONDecodeError:
                return None
        return valor


class PaginaLeads(BaseModel):
    total: int
    pagina: int
    por_pagina: int
    paginas: int
    itens: list[LeadSaida]


class Filtros(BaseModel):
    """Filtros da listagem, do export e do dashboard."""

    model_config = ConfigDict(extra="ignore")

    q: str | None = None
    cidade: str | None = None
    estado: str | None = None
    categoria: str | None = None
    status: list[StatusLead] | None = None
    faixa: list[Faixa] | None = None
    site: SituacaoSite | None = None
    website_status: StatusWebsite | None = None
    score_min: int | None = Field(default=None, ge=0, le=100)
    score_max: int | None = Field(default=None, ge=0, le=100)
    avaliacao_min: float | None = Field(default=None, ge=0, le=5)
    avaliacoes_min: int | None = Field(default=None, ge=0)
    tem_telefone: bool | None = None
    tem_instagram: bool | None = None
    tem_website: bool | None = None
    ordenar: Literal[
        "score", "-score", "nome", "-nome", "recentes", "avaliacoes", "-avaliacoes"
    ] = "-score"


class MudancaStatus(BaseModel):
    status: StatusLead
    observacao: str | None = None


class DuplicataSaida(BaseModel):
    lead_id: int
    nome_empresa: str
    motivo: str
    similaridade: float


class RelatorioImport(BaseModel):
    total_linhas: int
    importados: int
    duplicados: int
    erros: int
    ids_importados: list[int] = []
    detalhes_duplicados: list[dict[str, Any]] = []
    detalhes_erros: list[dict[str, Any]] = []


class ResumoDashboard(BaseModel):
    total_leads: int
    sem_site: int
    hot: int
    abordados: int
    respostas: int
    interessados: int
    propostas: int
    vendas: int
    taxa_resposta: float
    taxa_conversao: float
    valor_vendido: float
    ticket_medio: float
    por_faixa: dict[str, int]
    por_status: dict[str, int]
    por_nicho: list[dict[str, Any]]
    por_cidade: list[dict[str, Any]]
    por_abordagem: list[dict[str, Any]]


class ConfiguracaoEntrada(BaseModel):
    model_config = ConfigDict(extra="forbid")

    pesos: dict[str, int]
    limiares: dict[str, float]
    faixas: list[dict[str, Any]]
    nichos: list[dict[str, Any]]
