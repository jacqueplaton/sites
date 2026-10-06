#!/usr/bin/env bash
# ==========================================================================
# Build do site da Toca do Tucano (Netlify e Vercel)
# --------------------------------------------------------------------------
# 1. copia para dist/ só o que vai para o ar (deixa README e scripts fora);
# 2. troca o endereço provisório das URLs de SEO (canonical, Open Graph,
#    JSON-LD, robots.txt, sitemap.xml) pelo endereço real do site.
#
# Ordem de prioridade do endereço:
#   SITE_URL                        -> defina quando tiver domínio próprio
#   URL                             -> Netlify (endereço de produção)
#   VERCEL_PROJECT_PRODUCTION_URL   -> Vercel (endereço de produção)
# ==========================================================================
set -euo pipefail
cd "$(dirname "$0")"

ORIGEM="https://toca-do-tucano.netlify.app"

rm -rf dist
mkdir -p dist
cp -r _headers index.html 404.html favicon.svg site.webmanifest robots.txt sitemap.xml css js fonts media dist/

DESTINO="${SITE_URL:-${URL:-}}"
if [ -z "$DESTINO" ] && [ -n "${VERCEL_PROJECT_PRODUCTION_URL:-}" ]; then
  DESTINO="https://${VERCEL_PROJECT_PRODUCTION_URL}"
fi

if [ -n "$DESTINO" ]; then
  DESTINO="${DESTINO%/}"
  echo "==> URLs de SEO apontando para $DESTINO"
  find dist -maxdepth 1 -type f \( -name '*.html' -o -name '*.xml' -o -name '*.txt' \) \
    -exec sed -i "s#${ORIGEM}#${DESTINO}#g" {} +
else
  echo "==> Sem endereço definido: URLs de SEO mantidas em ${ORIGEM}"
fi

du -sh dist
