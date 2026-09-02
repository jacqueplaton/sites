#!/usr/bin/env python3
"""LEAD MACHINE — ponto de entrada.

    python main.py              sobe o servidor
    python main.py --seed       carrega os leads fictícios e sai
"""

from __future__ import annotations

import argparse
import logging

import uvicorn

from app.app import criar_app
from app.config import configurar_logs, settings
from app.database import SessionLocal, criar_tabelas


def carregar_seeds(forcar: bool) -> None:
    from app.seeds import semear

    criar_tabelas()
    with SessionLocal() as db:
        resultado = semear(db, forcar=forcar)
    if resultado.get("ja_havia_dados"):
        print("A base já tem leads. Use --seed --forcar para inserir mesmo assim.")
    else:
        print(f"{resultado['criados']} leads fictícios criados "
              f"({resultado['duplicados']} ignorados por duplicidade).")


def main() -> None:
    parser = argparse.ArgumentParser(description="LEAD MACHINE")
    parser.add_argument("--seed", action="store_true", help="carrega leads fictícios e sai")
    parser.add_argument("--forcar", action="store_true", help="usado junto com --seed")
    parser.add_argument("--host", default=settings.host)
    parser.add_argument("--port", type=int, default=settings.port)
    parser.add_argument("--reload", action="store_true", help="recarrega ao salvar (dev)")
    args = parser.parse_args()

    configurar_logs()

    if args.seed:
        carregar_seeds(args.forcar)
        return

    logging.getLogger("lead_machine").info(
        "LEAD MACHINE em http://%s:%s (banco: %s)", args.host, args.port, settings.db_path
    )
    if args.reload:
        uvicorn.run("app.app:app", host=args.host, port=args.port, reload=True)
    else:
        uvicorn.run(criar_app(), host=args.host, port=args.port)


if __name__ == "__main__":
    main()
