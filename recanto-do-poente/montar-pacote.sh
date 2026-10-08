#!/usr/bin/env bash
# ==========================================================================
# Monta o ZIP de publicação do Recanto do Poente.
# --------------------------------------------------------------------------
# Entra no pacote só o que vai para o ar: index.html na raiz, css, js,
# assets, favicon, robots.txt e netlify.toml.
# Fica de fora: LEIA-ME.md, ferramentas/ e este próprio script.
#
# Uso:  bash montar-pacote.sh
# Saída: recanto-do-poente-site.zip (na pasta do projeto)
# ==========================================================================
set -euo pipefail

cd "$(dirname "$0")"

PACOTE="recanto-do-poente-site.zip"
rm -f "$PACOTE"

zip -r -q "$PACOTE" \
  index.html favicon.svg robots.txt netlify.toml css js assets \
  -x '*.DS_Store' '__MACOSX/*'

echo "==> $PACOTE"
unzip -l "$PACOTE" | tail -n 1
du -h "$PACOTE" | cut -f1
