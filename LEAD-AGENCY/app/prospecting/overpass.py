"""Coleta de negócios locais no OpenStreetMap, via API Overpass.

Fonte gratuita e aberta (dados sob ODbL — a atribuição ao OpenStreetMap é
obrigatória em qualquer uso público). Duas chamadas: Nominatim para
transformar "Campinas, SP" em coordenada, e Overpass para listar os
estabelecimentos do nicho num raio.

O que o OSM **não** entrega, e por isso o app não preenche: nota, número de
avaliações, Instagram na maioria dos casos e URL do Google Maps. Sem nota e
sem avaliações, o score perde as regras de reputação — o que torna esta fonte
fraca justamente para separar lead com alto poder de compra. Para isso, a
fonte adequada é a Places API.
"""

from __future__ import annotations

import json
import logging
from typing import Any
from urllib.parse import quote_plus

from app.prospecting.fontes import ParametrosBusca, ResultadoBusca
from app.core.http_client import ClienteHTTP, cliente_http
from app.lead_scoring.niches import _slug

logger = logging.getLogger(__name__)

URL_NOMINATIM = "https://nominatim.openstreetmap.org/search"
URL_OVERPASS = "https://overpass-api.de/api/interpreter"

# nicho do catálogo -> filtros de tag do OSM.
# Só entra o que o OSM realmente etiqueta. Nicho sem tag boa fica de fora e o
# app avisa, em vez de devolver a categoria errada.
TAGS_POR_NICHO: dict[str, list[str]] = {
    "dentista": ['["amenity"="dentist"]'],
    "clinica": ['["amenity"="clinic"]', '["healthcare"="clinic"]'],
    "advocacia": ['["office"="lawyer"]'],
    "estetica": ['["shop"="beauty"]'],
    "salao": ['["shop"="hairdresser"]'],
    "barbearia": ['["shop"="hairdresser"]'],
    "academia": ['["leisure"="fitness_centre"]'],
    "oficina": ['["shop"="car_repair"]'],
    "auto_center": ['["shop"="car_repair"]', '["shop"="tyres"]'],
    "imobiliaria": ['["office"="estate_agent"]'],
    "restaurante": ['["amenity"="restaurant"]'],
    "contador": ['["office"="accountant"]'],
    "arquiteto": ['["office"="architect"]'],
    "fisioterapeuta": ['["healthcare"="physiotherapist"]'],
    "nutricionista": ['["healthcare"="nutrition_counselling"]'],
}

NICHOS_SEM_TAG = {
    "personal": "o OSM não etiqueta personal trainer como estabelecimento",
    "nutricionista": "a etiqueta existe, mas é rara no Brasil — espere pouco resultado",
}

LIMITE_BYTES = 8_000_000


class FonteOverpass:
    nome = "openstreetmap"

    def __init__(self, cliente: ClienteHTTP | None = None) -> None:
        self.cliente = cliente or cliente_http

    # -- geocodificação ----------------------------------------------------
    def geocodificar(
        self, parametros: ParametrosBusca
    ) -> tuple[tuple[float, float] | None, str | None]:
        """Cidade em texto -> (lat, lon), pelo Nominatim.

        Devolve (coordenada, erro). O erro separa dois casos que se parecem
        na tela e não são a mesma coisa: o serviço não respondeu (rede,
        bloqueio, fora do ar) e o serviço respondeu que não conhece a cidade.
        """
        partes = [parametros.cidade, parametros.estado, parametros.pais]
        consulta = ", ".join(p for p in partes if p and p.strip())
        url = f"{URL_NOMINATIM}?q={quote_plus(consulta)}&format=json&limit=1"

        resposta = self.cliente.obter(url, limite_bytes=200_000, aceita="application/json")
        if not resposta.ok:
            detalhe = resposta.erro or f"HTTP {resposta.status}"
            return None, (
                f"não consegui falar com o Nominatim para localizar "
                f"'{parametros.cidade}' ({detalhe}). Confira a conexão — em rede "
                "restrita, os servidores do OpenStreetMap podem estar bloqueados."
            )
        try:
            dados = json.loads(resposta.texto) if resposta.texto else []
        except json.JSONDecodeError:
            logger.warning("Nominatim devolveu resposta ilegível para %r", consulta)
            return None, "o Nominatim devolveu uma resposta que não é JSON."
        if not dados:
            return None, (
                f"o Nominatim não conhece '{consulta}'. Confira o nome da cidade "
                "e do estado."
            )
        try:
            return (float(dados[0]["lat"]), float(dados[0]["lon"])), None
        except (KeyError, TypeError, ValueError):
            return None, "o Nominatim respondeu num formato inesperado."

    # -- consulta ----------------------------------------------------------
    def montar_consulta(self, tags: list[str], lat: float, lon: float, raio_m: int) -> str:
        corpo = "".join(
            f'{tipo}{tag}(around:{raio_m},{lat},{lon});'
            for tag in tags
            for tipo in ("node", "way")
        )
        return f"[out:json][timeout:60];({corpo});out center;"

    def buscar(self, parametros: ParametrosBusca) -> ResultadoBusca:
        resultado = ResultadoBusca()

        chave = _slug(parametros.nicho)
        tags = TAGS_POR_NICHO.get(chave)
        if not tags:
            suportados = ", ".join(sorted(TAGS_POR_NICHO))
            resultado.erro = (
                f"o OpenStreetMap não tem etiqueta confiável para o nicho "
                f"'{parametros.nicho}'. Nichos suportados nesta fonte: {suportados}."
            )
            return resultado
        if chave in NICHOS_SEM_TAG:
            resultado.avisos.append(NICHOS_SEM_TAG[chave])

        coordenada, erro = self.geocodificar(parametros)
        if coordenada is None:
            resultado.erro = erro
            return resultado

        lat, lon = coordenada
        raio_m = int(max(0.5, min(parametros.raio_km, 50)) * 1000)
        consulta = self.montar_consulta(tags, lat, lon, raio_m)
        url = f"{URL_OVERPASS}?data={quote_plus(consulta)}"

        resposta = self.cliente.obter(url, limite_bytes=LIMITE_BYTES, aceita="application/json")
        if not resposta.ok:
            resultado.erro = f"a Overpass não respondeu ({resposta.erro or resposta.status})."
            return resultado
        try:
            dados = json.loads(resposta.texto)
        except json.JSONDecodeError:
            resultado.erro = "a Overpass devolveu uma resposta que não é JSON."
            return resultado

        elementos = dados.get("elements", [])
        resultado.encontrados = len(elementos)

        for elemento in elementos:
            if len(resultado.leads) >= max(1, parametros.quantidade):
                break
            lead = self._para_lead(elemento, parametros)
            if lead is None:
                continue
            if not self._passa_nos_filtros(lead, parametros):
                resultado.descartados_por_filtro += 1
                continue
            resultado.leads.append(lead)

        if parametros.avaliacao_min or parametros.avaliacoes_min:
            resultado.avisos.append(
                "o OpenStreetMap não traz nota nem número de avaliações — "
                "esses dois filtros não foram aplicados"
            )
        if parametros.so_com_instagram:
            resultado.avisos.append(
                "Instagram quase nunca está no OSM; o filtro derrubaria quase tudo "
                "e por isso não foi aplicado"
            )
        resultado.avisos.append(
            "dados © colaboradores do OpenStreetMap (ODbL) — a atribuição é "
            "obrigatória em qualquer uso público"
        )
        return resultado

    # -- conversão ---------------------------------------------------------
    def _para_lead(self, elemento: dict[str, Any], parametros: ParametrosBusca) -> dict | None:
        tags: dict[str, str] = elemento.get("tags") or {}
        nome = (tags.get("name") or "").strip()
        if len(nome) < 2:
            return None  # ponto sem nome não serve para prospectar

        telefone = (
            tags.get("phone") or tags.get("contact:phone") or tags.get("contact:mobile") or ""
        ).strip()
        website = (tags.get("website") or tags.get("contact:website") or "").strip()
        instagram = (tags.get("contact:instagram") or "").strip()
        facebook = (tags.get("contact:facebook") or "").strip()

        endereco = " ".join(
            parte for parte in (
                tags.get("addr:street", ""),
                tags.get("addr:housenumber", ""),
                tags.get("addr:suburb", ""),
            ) if parte
        ).strip()

        tipo = elemento.get("type", "node")
        identificador = elemento.get("id")

        return {
            "nome_empresa": nome,
            "categoria": _slug(parametros.nicho),
            "cidade": tags.get("addr:city") or parametros.cidade,
            "estado": parametros.estado,
            "pais": parametros.pais,
            "endereco": endereco or None,
            "telefone": telefone or None,
            "website": website or None,
            "instagram": instagram or None,
            "facebook": facebook or None,
            "horario": tags.get("opening_hours") or None,
            "descricao": tags.get("description") or None,
            "fonte": "openstreetmap",
            "observacoes": (
                f"Coletado do OpenStreetMap: https://www.openstreetmap.org/{tipo}/{identificador}"
                if identificador else "Coletado do OpenStreetMap"
            ),
        }

    def _passa_nos_filtros(self, lead: dict, parametros: ParametrosBusca) -> bool:
        # "só sem site" aqui significa "sem o campo website no OSM". Quem
        # decide se a empresa realmente não tem site é o detector, depois.
        if parametros.so_sem_site and lead.get("website"):
            return False
        if parametros.so_com_telefone and not lead.get("telefone"):
            return False
        return True
