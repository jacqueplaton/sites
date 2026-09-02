"""Comandos de terminal do LEAD AGENCY OS.

Cada subcomando é uma etapa do funil. O que ainda não existe recusa a
execução dizendo em que fase entra — nenhum comando finge trabalho feito.
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
import unicodedata
from pathlib import Path
from typing import Any

from sqlalchemy import select

from app.core.config import BASE_DIR, configurar_logs
from app.core.database import SessionLocal, criar_tabelas
from app.crm import crud
from app.crm.models import Faixa, Lead, StatusLead, StatusWebsite
from app.crm.schemas import Filtros
from app.dashboard.metrics import resumo_dashboard

logger = logging.getLogger("lead_agency.cli")

PASTAS_DO_FUNIL = {
    StatusLead.NOVO: "novos",
    StatusLead.QUALIFICADO: "qualificados",
    StatusLead.SITE_CRIADO: "qualificados",
    StatusLead.ABORDAR: "qualificados",
    StatusLead.ABORDADO: "abordados",
    StatusLead.RESPONDEU: "abordados",
    StatusLead.INTERESSADO: "abordados",
    StatusLead.REUNIAO: "abordados",
    StatusLead.PROPOSTA: "abordados",
    StatusLead.NEGOCIACAO: "abordados",
    StatusLead.FECHADO: "clientes",
}


def _slug(texto: str) -> str:
    normal = unicodedata.normalize("NFKD", texto or "")
    normal = "".join(c for c in normal if not unicodedata.combining(c)).lower()
    limpo = "".join(c if c.isalnum() else "-" for c in normal)
    while "--" in limpo:
        limpo = limpo.replace("--", "-")
    return limpo.strip("-") or "lead"


def gravar_dossie(lead: Lead) -> Path | None:
    """Espelha o lead num arquivo dentro de leads/<etapa>/.

    O banco continua sendo a fonte da verdade; estes arquivos existem para o
    funil ser legível no sistema de arquivos, como pede a estrutura do
    projeto. Um lead que muda de etapa some da pasta antiga.
    """
    pasta_destino = PASTAS_DO_FUNIL.get(StatusLead(lead.status))
    if pasta_destino is None:
        return None

    nome = f"{lead.id:05d}-{_slug(lead.nome_empresa)}.json"
    raiz = BASE_DIR / "leads"
    for pasta in {"novos", "qualificados", "abordados", "clientes"}:
        antigo = raiz / pasta / nome
        if antigo.exists() and pasta != pasta_destino:
            antigo.unlink()

    destino = raiz / pasta_destino
    destino.mkdir(parents=True, exist_ok=True)
    caminho = destino / nome
    dados = {
        coluna.name: getattr(lead, coluna.name)
        for coluna in Lead.__table__.columns
        if not coluna.name.startswith("chave_")
    }
    caminho.write_text(
        json.dumps(dados, ensure_ascii=False, indent=2, default=str), encoding="utf-8"
    )
    return caminho


def _confirmar(pergunta: str, automatico: bool) -> bool:
    if automatico:
        return True
    if not sys.stdin.isatty():
        print("  (sem terminal interativo — use --sim para confirmar)")
        return False
    return input(f"{pergunta} [s/N] ").strip().lower() in {"s", "sim", "y", "yes"}


# --------------------------------------------------------------------------
# prospectar
# --------------------------------------------------------------------------

def comando_prospectar(args: argparse.Namespace) -> int:
    from app.prospecting.fontes import ParametrosBusca, fonte_por_nome
    from app.lead_scoring.dedupe import LeadDuplicadoError

    criar_tabelas()
    try:
        fonte = fonte_por_nome(args.source)
    except ValueError as exc:
        print(f"ERRO: {exc}")
        return 2

    print(f"Fonte: {args.source} · {args.niche} em {args.city}/{args.state or '—'} "
          f"· até {args.limit} leads · raio {args.radius} km")
    if not _confirmar("Consultar a fonte externa agora?", args.sim):
        print("Cancelado.")
        return 1

    parametros = ParametrosBusca(
        cidade=args.city, estado=args.state, nicho=args.niche,
        quantidade=args.limit, raio_km=args.radius,
        so_sem_site=args.only_no_website, so_com_telefone=args.only_phone,
    )
    resultado = fonte.buscar(parametros)
    if resultado.erro:
        print(f"ERRO: {resultado.erro}")
        return 3

    novos = duplicados = 0
    with SessionLocal() as db:
        for registro in resultado.leads:
            try:
                lead = crud.criar_lead(db, registro, verificar_site=False)
                gravar_dossie(lead)
                novos += 1
            except LeadDuplicadoError as exc:
                duplicados += 1
                logger.debug("duplicado: %s", exc)

    for aviso in resultado.avisos:
        print(f"  aviso: {aviso}")
    print(f"\n{resultado.encontrados} encontrados na fonte · "
          f"{resultado.descartados_por_filtro} descartados pelos filtros · "
          f"{novos} novos · {duplicados} duplicados bloqueados")
    print("Os leads entraram com o site NAO_VERIFICADO. "
          "Rode `scripts/qualificar` para verificar e pontuar.")
    return 0


# --------------------------------------------------------------------------
# qualificar
# --------------------------------------------------------------------------

def comando_qualificar(args: argparse.Namespace) -> int:
    criar_tabelas()
    with SessionLocal() as db:
        consulta = select(Lead).where(Lead.status == StatusLead.NOVO)
        if args.lead_id:
            consulta = select(Lead).where(Lead.id == args.lead_id)
        leads = list(db.execute(consulta.limit(args.limit)).scalars())

        if not leads:
            print("Nenhum lead NOVO para qualificar.")
            return 0

        print(f"{len(leads)} lead(s) para qualificar.")
        pergunta = f"Verificar o site de {len(leads)} lead(s) por HTTP?"
        if args.buscar_dominio:
            pergunta += (
                "\n  Com --buscar-dominio: para quem não tem site na fonte, o app "
                "testa\n  domínios derivados do nome (empresa.com.br, empresa.com). "
                "É o único\n  caminho para concluir SEM_SITE e valer os +30 do score."
            )
        verificar = args.verificar_site and _confirmar(pergunta, args.sim)
        if args.verificar_site and not verificar:
            print("Seguindo sem verificação de site: nenhum lead será marcado "
                  "como SEM_SITE (ausência não verificada não é ausência).")

        promovidos = nao_verificados = 0
        for lead in leads:
            if verificar:
                crud.verificar_site_do_lead(db, lead, buscar_dominio=args.buscar_dominio)
            else:
                crud.aplicar_score_do_lead(db, lead)
            if lead.score >= args.corte:
                lead.status = StatusLead.QUALIFICADO
                promovidos += 1
            if verificar and lead.website_status == StatusWebsite.NAO_VERIFICADO:
                nao_verificados += 1
            db.commit()
            gravar_dossie(lead)
            print(f"  #{lead.id:<4} {lead.score:>3} {lead.faixa:<5} "
                  f"{lead.site_situacao:<20} {lead.nome_empresa}")

        if verificar and nao_verificados == len(leads):
            print(
                "\n  ATENÇÃO: nenhuma verificação de site foi concluída — todas as "
                "tentativas\n  falharam por rede. Nenhum lead foi marcado como sem "
                "site, e por isso\n  os scores estão mais baixos do que ficariam com "
                "a verificação. Confira a\n  conexão e rode de novo."
            )

        print(f"\n{promovidos} promovido(s) a QUALIFICADO (corte: score ≥ {args.corte}).")
    return 0


# --------------------------------------------------------------------------
# dashboard
# --------------------------------------------------------------------------

def _linha(rotulo: str, valor: Any) -> str:
    return f"  {rotulo:<22} {valor}"


def _reais(valor: float) -> str:
    """1234.5 -> 'R$ 1.234,50' (o formato do Python usa a convenção inglesa)."""
    return "R$ " + f"{valor:,.2f}".replace(",", "\x00").replace(".", ",").replace("\x00", ".")


def comando_dashboard(_args: argparse.Namespace) -> int:
    criar_tabelas()
    with SessionLocal() as db:
        d = resumo_dashboard(db, Filtros())

    print("\n=== LEAD AGENCY — DASHBOARD ===\n")
    print(_linha("Leads encontrados", d["total_leads"]))
    print(_linha("Sem site (verificado)", d["sem_site"]))
    print(_linha("Qualificados", d["por_status"].get("QUALIFICADO", 0)))
    print(_linha("Sites criados", d["por_status"].get("SITE_CRIADO", 0)))
    print(_linha("Abordados", d["abordados"]))
    print(_linha("Respostas", f'{d["respostas"]} ({d["taxa_resposta"]}%)'))
    print(_linha("Propostas", d["propostas"]))
    print(_linha("Clientes", f'{d["vendas"]} ({d["taxa_conversao"]}%)'))
    print(_linha("Receita", _reais(d["valor_vendido"])))
    print(_linha("Ticket médio", _reais(d["ticket_medio"])))

    print("\n  Faixas: " + " · ".join(f"{f}: {d['por_faixa'].get(f, 0)}" for f in Faixa))

    def melhor(chave: str, rotulo: str) -> None:
        linhas = [g for g in d[chave] if g["leads"]]
        if not linhas:
            return
        por_conversao = max(linhas, key=lambda g: (g["conversao"], g["leads"]))
        campeao = por_conversao if por_conversao["vendas"] else max(linhas, key=lambda g: g["leads"])
        criterio = "conversão" if campeao["vendas"] else "volume, ainda sem venda"
        print(_linha(rotulo, f'{campeao["chave"]} '
                             f'({campeao["leads"]} leads, {campeao["conversao"]}% — {criterio})'))

    print()
    melhor("por_nicho", "Melhor nicho")
    melhor("por_cidade", "Melhor cidade")
    melhor("por_abordagem", "Melhor abordagem")
    print("\n  Melhor fonte           métrica ainda não quebrada por fonte "
          "(entra junto com a segunda fonte de coleta)\n")
    return 0


# --------------------------------------------------------------------------
# etapas ainda não implementadas
# --------------------------------------------------------------------------

def comando_criar_site(args: argparse.Namespace) -> int:
    criar_tabelas()
    with SessionLocal() as db:
        lead = crud.obter_lead(db, args.lead_id)
    if lead is None:
        print(f"ERRO: lead #{args.lead_id} não existe.")
        return 2
    print(
        f"Lead #{lead.id} — {lead.nome_empresa} ({lead.faixa}, score {lead.score})\n\n"
        "O gerador de sites-demo é a Fase 4 e ainda não existe: app/site_generator/\n"
        "está vazio de propósito. Este comando não vai criar uma pasta pela metade\n"
        "em sites/clientes/ nem inventar conteúdo sobre o negócio.\n\n"
        "O que já dá para usar hoje: a auditoria do lead, em\n"
        f"  http://127.0.0.1:8000/auditoria/{lead.id}"
    )
    return 1


def comando_pipeline(args: argparse.Namespace) -> int:
    print("PIPELINE — etapas 1 a 6 (coleta, dedupe, score, seleção)\n")
    if comando_prospectar(args) != 0:
        return 1
    codigo = comando_qualificar(args)
    print(
        "\nEtapas 7 a 11 (auditoria .md, site-demo, copy, mensagens, CRM automático)\n"
        "dependem das Fases 3 e 4, que ainda não existem. O pipeline para aqui em\n"
        "vez de gerar arquivo vazio. Os leads coletados e pontuados já estão no CRM."
    )
    return codigo


# --------------------------------------------------------------------------

def construir_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="lead-agency", description="LEAD AGENCY OS")
    sub = parser.add_subparsers(dest="comando", required=True)

    def com_busca(p: argparse.ArgumentParser) -> None:
        p.add_argument("--city", required=True, help="cidade")
        p.add_argument("--state", default=None, help="estado (UF)")
        p.add_argument("--niche", required=True, help="nicho")
        p.add_argument("--limit", type=int, default=20, help="máximo de leads")
        p.add_argument("--radius", type=float, default=10, help="raio em km")
        p.add_argument("--source", default="openstreetmap", help="fonte de coleta")
        p.add_argument("--only-no-website", action="store_true")
        p.add_argument("--only-phone", action="store_true")
        p.add_argument("--sim", "-y", action="store_true", help="não perguntar nada")

    p = sub.add_parser("prospectar", help="coleta leads numa fonte permitida")
    com_busca(p)
    p.set_defaults(funcao=comando_prospectar)

    p = sub.add_parser("qualificar", help="verifica site, pontua e promove")
    p.add_argument("--lead-id", type=int, default=None)
    p.add_argument("--limit", type=int, default=50)
    p.add_argument("--corte", type=int, default=60, help="score mínimo para QUALIFICADO")
    p.add_argument("--sem-verificar-site", dest="verificar_site", action="store_false")
    p.add_argument(
        "--buscar-dominio", action="store_true",
        help="testa domínios derivados do nome quando a fonte não traz website; "
             "é o que permite concluir SEM_SITE",
    )
    p.add_argument("--sim", "-y", action="store_true")
    p.set_defaults(funcao=comando_qualificar)

    p = sub.add_parser("dashboard", help="métricas no terminal")
    p.set_defaults(funcao=comando_dashboard)

    p = sub.add_parser("criar-site", help="site-demo do lead (Fase 4)")
    p.add_argument("lead_id", type=int)
    p.set_defaults(funcao=comando_criar_site)

    p = sub.add_parser("pipeline", help="coleta + qualificação em sequência")
    com_busca(p)
    p.add_argument("--corte", type=int, default=60)
    p.add_argument("--buscar-dominio", action="store_true")
    p.set_defaults(funcao=comando_pipeline, lead_id=None, verificar_site=True)

    return parser


def main(argv: list[str] | None = None) -> int:
    configurar_logs()
    args = construir_parser().parse_args(argv)
    return int(args.funcao(args) or 0)


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
