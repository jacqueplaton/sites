#!/usr/bin/env bash
# ==========================================================================
# Build do site para o Netlify
# --------------------------------------------------------------------------
# Faz duas coisas:
#   1. separa numa pasta _site apenas os arquivos que devem ir para o ar
#      (deixa de fora .claude, .github, README, scripts);
#   2. troca as URLs absolutas de SEO pelo endereço real que o Netlify
#      atribuiu ao site, para canonical, Open Graph, hreflang, JSON-LD,
#      robots.txt e sitemap.xml não ficarem apontando para o lugar errado.
#
# O Netlify define $URL automaticamente (ex.: https://seu-site.netlify.app).
# Rodando fora do Netlify, o script não mexe nas URLs.
# ==========================================================================
set -euo pipefail

ORIGEM="https://jacqueplaton.github.io/sites"

echo "==> Separando os arquivos do site"
rm -rf _site
mkdir -p _site
cp -r index.html favicon.svg robots.txt sitemap.xml css js fonts media _site/

# Escolhe a URL: deploys de produção usam $URL; previews de branch e de pull
# request usam $DEPLOY_PRIME_URL, que aponta para aquele deploy específico.
DESTINO="${DEPLOY_PRIME_URL:-${URL:-}}"

if [ -n "$DESTINO" ]; then
  DESTINO="${DESTINO%/}"           # tira a barra final, se houver
  echo "==> Ajustando as URLs de SEO para $DESTINO"
  find _site -type f \( -name '*.html' -o -name '*.xml' -o -name '*.txt' \) \
    -exec sed -i "s#${ORIGEM}#${DESTINO}#g" {} +
else
  echo "==> Fora do Netlify: mantendo as URLs como estão"
fi

echo "==> Pronto"
du -sh _site
find _site -type f | wc -l
