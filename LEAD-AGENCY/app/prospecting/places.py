"""Coleta na Google Places API (Text Search — Places API New).

É a única fonte que entrega, na mesma resposta, o que o score precisa para
separar lead com poder de compra: **site, telefone, nota e número de
avaliações**. Por isso é a fonte recomendada, apesar de paga.

Contrato usado (documentação oficial):

    POST https://places.googleapis.com/v1/places:searchText
    Headers: Content-Type: application/json
             X-Goog-Api-Key: <chave>
             X-Goog-FieldMask: <campos>
    Body:    {"textQuery": "...", "pageSize": N, "pageToken": "..."}
    Resposta: {"places": [...], "nextPageToken": "..."}

Custo: a Text Search é cobrada por requisição, e os campos que pedimos aqui
(site, telefone, nota, avaliações) ficam em faixas acima do Essentials. Antes
de rodar em volume, confira a tabela e a calculadora oficiais — este código
não estima preço. O que ele faz é gastar o mínimo: uma requisição por página,
no máximo `quantidade` resultados, com cache por consulta para uma busca
repetida por engano não ser cobrada duas vezes.

Fonte: https://developers.google.com/maps/documentation/places/web-service/text-search
"""

from __future__ import annotations

import json
import logging
from typing import Any

from app.core.config import settings
from app.core.http_client import ClienteHTTP, cliente_http
from app.lead_scoring.niches import _slug
from app.prospecting.fontes import ParametrosBusca, ResultadoBusca

logger = logging.getLogger(__name__)

# Campos pedidos. Cada campo a mais pode subir a faixa de cobrança, então a
# lista é exatamente o que o score e a abordagem consomem — nada "por via das
# dúvidas".
CAMPOS = (
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.nationalPhoneNumber",
    "places.internationalPhoneNumber",
    "places.websiteUri",
    "places.rating",
    "places.userRatingCount",
    "places.regularOpeningHours.weekdayDescriptions",
    "places.primaryTypeDisplayName",
    "places.googleMapsUri",
    "places.businessStatus",
    "nextPageToken",
)

# A Text Search devolve no máximo 60 resultados no total, 20 por página.
MAXIMO_POR_PAGINA = 20
MAXIMO_TOTAL = 60

# O negócio precisa estar operando para valer uma abordagem.
STATUS_ACEITOS = {"OPERATIONAL", None, ""}


class FontePlaces:
    nome = "google_places"

    def __init__(self, cliente: ClienteHTTP | None = None, chave: str | None = None) -> None:
        self.cliente = cliente or cliente_http
        self.chave = chave if chave is not None else settings.google_maps_api_key

    # -- consulta ----------------------------------------------------------
    def montar_consulta(self, parametros: ParametrosBusca) -> str:
        """Text Search aceita a localidade no próprio texto — sem geocodificar."""
        lugar = ", ".join(
            parte for parte in (parametros.cidade, parametros.estado, parametros.pais)
            if parte and parte.strip()
        )
        return f"{parametros.nicho} em {lugar}" if lugar else parametros.nicho

    def buscar(self, parametros: ParametrosBusca) -> ResultadoBusca:
        resultado = ResultadoBusca()

        if not self.chave.strip():
            resultado.erro = (
                "a Google Places API precisa de chave própria. Crie uma no Google "
                "Cloud (com conta de faturamento e a Places API habilitada) e "
                "coloque em GOOGLE_MAPS_API_KEY no .env. Sem chave, esta fonte "
                "não faz requisição nenhuma."
            )
            return resultado

        desejados = max(1, min(parametros.quantidade, MAXIMO_TOTAL))
        if parametros.quantidade > MAXIMO_TOTAL:
            resultado.avisos.append(
                f"a Text Search devolve no máximo {MAXIMO_TOTAL} resultados por "
                f"consulta; pedidos {parametros.quantidade}, buscando {desejados}. "
                "Para mais, varie o nicho ou o bairro na busca."
            )

        corpo_base: dict[str, Any] = {
            "textQuery": self.montar_consulta(parametros),
            "pageSize": min(MAXIMO_POR_PAGINA, desejados),
        }
        cabecalhos = {
            "X-Goog-Api-Key": self.chave.strip(),
            "X-Goog-FieldMask": ",".join(CAMPOS),
        }

        token: str | None = None
        paginas = 0
        while len(resultado.leads) < desejados and paginas < 3:
            corpo = dict(corpo_base)
            if token:
                corpo["pageToken"] = token

            resposta = self.cliente.postar_json(settings.places_url, corpo, cabecalhos)
            paginas += 1

            if resposta.erro:
                resultado.erro = f"não consegui falar com a Places API ({resposta.erro})."
                return resultado

            try:
                dados = json.loads(resposta.texto) if resposta.texto else {}
            except json.JSONDecodeError:
                resultado.erro = "a Places API devolveu uma resposta que não é JSON."
                return resultado

            if not resposta.ok:
                # Repassa a mensagem do Google literalmente: ela costuma dizer
                # exatamente o que falta (faturamento, API não habilitada,
                # chave restrita, campo inválido no field mask).
                erro = (dados.get("error") or {}).get("message") or resposta.texto[:300]
                resultado.erro = f"a Places API recusou (HTTP {resposta.status}): {erro}"
                return resultado

            lugares = dados.get("places") or []
            resultado.encontrados += len(lugares)

            for lugar in lugares:
                if len(resultado.leads) >= desejados:
                    break
                lead = self._para_lead(lugar, parametros)
                if lead is None:
                    resultado.descartados_por_filtro += 1
                    continue
                if not self._passa_nos_filtros(lead, parametros):
                    resultado.descartados_por_filtro += 1
                    continue
                resultado.leads.append(lead)

            token = dados.get("nextPageToken")
            if not token:
                break

        if parametros.so_com_instagram:
            resultado.avisos.append(
                "a Places API não devolve perfil de Instagram; o filtro não foi "
                "aplicado (o site do lead costuma trazer o link)"
            )
        resultado.avisos.append(
            f"{paginas} requisição(ões) à Places API — a cobrança é por requisição"
        )
        return resultado

    # -- conversão ---------------------------------------------------------
    def _para_lead(self, lugar: dict[str, Any], parametros: ParametrosBusca) -> dict | None:
        nome = ((lugar.get("displayName") or {}).get("text") or "").strip()
        if len(nome) < 2:
            return None

        if lugar.get("businessStatus") not in STATUS_ACEITOS:
            return None  # fechado em definitivo ou temporariamente

        horarios = (lugar.get("regularOpeningHours") or {}).get("weekdayDescriptions") or []
        categoria = (lugar.get("primaryTypeDisplayName") or {}).get("text")

        return {
            "nome_empresa": nome,
            # o nicho buscado é mais útil ao score que o rótulo do Google,
            # que vem traduzido e nem sempre casa com o catálogo de nichos
            "categoria": _slug(parametros.nicho),
            "subcategoria": categoria,
            "cidade": parametros.cidade,
            "estado": parametros.estado,
            "pais": parametros.pais,
            "endereco": lugar.get("formattedAddress"),
            "telefone": lugar.get("nationalPhoneNumber")
            or lugar.get("internationalPhoneNumber"),
            "website": lugar.get("websiteUri"),
            "google_maps_url": lugar.get("googleMapsUri"),
            "avaliacao": lugar.get("rating"),
            "qtd_avaliacoes": lugar.get("userRatingCount"),
            "horario": " | ".join(horarios) if horarios else None,
            "fonte": "google_places",
            "observacoes": f"Coletado da Google Places API (place id {lugar.get('id')})",
        }

    def _passa_nos_filtros(self, lead: dict, parametros: ParametrosBusca) -> bool:
        if parametros.so_sem_site and lead.get("website"):
            return False
        if parametros.so_com_telefone and not lead.get("telefone"):
            return False
        if parametros.avaliacao_min is not None:
            nota = lead.get("avaliacao")
            if nota is None or nota < parametros.avaliacao_min:
                return False
        if parametros.avaliacoes_min is not None:
            quantidade = lead.get("qtd_avaliacoes")
            if quantidade is None or quantidade < parametros.avaliacoes_min:
                return False
        return True
