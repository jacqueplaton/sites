"""Importação de leads a partir de CSV.

Aceita o cabeçalho em várias grafias (com acento, com espaço, em inglês nos
casos óbvios) porque planilha de cliente nunca vem padronizada. Cada linha é
deduplicada antes de entrar; nada é sobrescrito silenciosamente.
"""

from __future__ import annotations

import csv
import io
import logging
from typing import Any

from sqlalchemy.orm import Session

from app.crud import criar_lead
from app.dedupe import LeadDuplicadoError, normalizar_texto
from app.models import StatusLead

logger = logging.getLogger(__name__)

# chave normalizada do cabeçalho -> campo do modelo
COLUNAS = {
    "nome_empresa": "nome_empresa", "nome": "nome_empresa", "empresa": "nome_empresa",
    "razao social": "nome_empresa", "name": "nome_empresa", "title": "nome_empresa",
    "categoria": "categoria", "nicho": "categoria", "category": "categoria",
    "tipo": "categoria",
    "subcategoria": "subcategoria",
    "cidade": "cidade", "city": "cidade", "municipio": "cidade",
    "estado": "estado", "uf": "estado", "state": "estado",
    "pais": "pais", "country": "pais",
    "endereco": "endereco", "address": "endereco", "logradouro": "endereco",
    "telefone": "telefone", "phone": "telefone", "fone": "telefone",
    "celular": "telefone", "whatsapp": "telefone",
    "website": "website", "site": "website", "url": "website", "web site": "website",
    "instagram": "instagram", "ig": "instagram",
    "facebook": "facebook", "fb": "facebook",
    "google_maps_url": "google_maps_url", "google maps": "google_maps_url",
    "maps": "google_maps_url", "link maps": "google_maps_url",
    "avaliacao": "avaliacao", "nota": "avaliacao", "rating": "avaliacao",
    "qtd_avaliacoes": "qtd_avaliacoes", "avaliacoes": "qtd_avaliacoes",
    "numero de avaliacoes": "qtd_avaliacoes", "reviews": "qtd_avaliacoes",
    "nº de avaliações": "qtd_avaliacoes", "quantidade de avaliacoes": "qtd_avaliacoes",
    "total de avaliacoes": "qtd_avaliacoes",
    "horario": "horario", "horario de funcionamento": "horario", "hours": "horario",
    "descricao": "descricao", "description": "descricao",
    "fonte": "fonte", "source": "fonte",
    "status": "status",
    "observacoes": "observacoes", "observacao": "observacoes", "notas": "observacoes",
}

_NUMERICOS = {"avaliacao": float, "qtd_avaliacoes": int}


# normalizar_texto troca "_" por espaço, então o índice de busca também é
# normalizado — assim "nome_empresa", "Nome Empresa" e "NOME EMPRESA" casam.
_INDICE_COLUNAS = {normalizar_texto(chave): campo for chave, campo in COLUNAS.items()}


def _cabecalho(nome: str) -> str | None:
    return _INDICE_COLUNAS.get(normalizar_texto(nome))


def _converter(campo: str, valor: str) -> Any:
    texto = (valor or "").strip()
    if not texto:
        return None
    conversor = _NUMERICOS.get(campo)
    if conversor is None:
        return texto
    limpo = texto.replace(".", "").replace(",", ".") if conversor is float else texto
    limpo = "".join(c for c in limpo if c.isdigit() or c == ".")
    if not limpo:
        return None
    try:
        return conversor(float(limpo))
    except (TypeError, ValueError):
        return None


def _detectar_separador(amostra: str) -> str:
    """Decide pelo cabeçalho, não pelo arquivo inteiro.

    Contar o arquivo todo erra quando os números vêm com vírgula decimal
    ("4,8") num CSV separado por ponto e vírgula — que é o padrão do Excel
    em português.
    """
    cabecalho = amostra.splitlines()[0] if amostra.splitlines() else ""
    candidatos = {sep: cabecalho.count(sep) for sep in (";", ",", "\t")}
    melhor = max(candidatos, key=lambda sep: candidatos[sep])
    if candidatos[melhor] == 0:
        try:
            return csv.Sniffer().sniff(amostra, delimiters=",;\t").delimiter
        except csv.Error:
            return ","
    return melhor


def importar_csv(
    db: Session, conteudo: bytes | str, fonte_padrao: str = "import_csv"
) -> dict[str, Any]:
    """Lê o CSV e cria os leads. Devolve o relatório da importação."""
    if isinstance(conteudo, bytes):
        for codificacao in ("utf-8-sig", "utf-8", "latin-1"):
            try:
                texto = conteudo.decode(codificacao)
                break
            except UnicodeDecodeError:
                continue
        else:  # pragma: no cover - latin-1 nunca falha
            texto = conteudo.decode("utf-8", errors="replace")
    else:
        texto = conteudo

    separador = _detectar_separador(texto[:4096])
    leitor = csv.DictReader(io.StringIO(texto), delimiter=separador)

    if not leitor.fieldnames:
        return {
            "total_linhas": 0, "importados": 0, "duplicados": 0, "erros": 1,
            "ids_importados": [], "detalhes_duplicados": [],
            "detalhes_erros": [{"linha": 0, "erro": "arquivo sem cabeçalho"}],
        }

    mapa = {col: _cabecalho(col) for col in leitor.fieldnames}
    if "nome_empresa" not in mapa.values():
        return {
            "total_linhas": 0, "importados": 0, "duplicados": 0, "erros": 1,
            "ids_importados": [], "detalhes_duplicados": [],
            "detalhes_erros": [
                {
                    "linha": 0,
                    "erro": "não encontrei a coluna do nome da empresa "
                            "(aceito: nome_empresa, nome, empresa, razão social)",
                }
            ],
        }

    total = importados = duplicados = erros = 0
    ids: list[int] = []
    det_dup: list[dict[str, Any]] = []
    det_err: list[dict[str, Any]] = []

    for numero, linha in enumerate(leitor, start=2):
        total += 1
        dados: dict[str, Any] = {}
        for coluna, valor in linha.items():
            campo = mapa.get(coluna)
            if campo:
                dados[campo] = _converter(campo, valor if isinstance(valor, str) else "")

        nome = (dados.get("nome_empresa") or "").strip()
        if len(nome) < 2:
            erros += 1
            det_err.append({"linha": numero, "erro": "nome da empresa vazio"})
            continue

        status = str(dados.get("status") or "").strip().upper()
        dados["status"] = status if status in set(StatusLead) else StatusLead.NOVO
        dados.setdefault("fonte", fonte_padrao)
        dados["fonte"] = dados.get("fonte") or fonte_padrao

        try:
            # verificar_site=False: importação em massa não sai batendo na rede.
            lead = criar_lead(db, dados, verificar_site=False)
            importados += 1
            ids.append(lead.id)
        except LeadDuplicadoError as exc:
            duplicados += 1
            det_dup.append(
                {
                    "linha": numero,
                    "nome_empresa": nome,
                    "lead_existente": exc.duplicata.lead_id,
                    "motivo": exc.duplicata.motivo,
                }
            )
        except Exception as exc:  # pragma: no cover - linha inesperada
            db.rollback()
            erros += 1
            det_err.append({"linha": numero, "erro": str(exc)[:200]})
            logger.warning("erro ao importar a linha %s: %s", numero, exc)

    logger.info(
        "import CSV: %s linhas, %s importados, %s duplicados, %s erros",
        total, importados, duplicados, erros,
    )
    return {
        "total_linhas": total,
        "importados": importados,
        "duplicados": duplicados,
        "erros": erros,
        "ids_importados": ids,
        "detalhes_duplicados": det_dup[:200],
        "detalhes_erros": det_err[:200],
    }
