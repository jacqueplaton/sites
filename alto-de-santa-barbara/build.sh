#!/usr/bin/env bash
# ==========================================================================
# Monta a pasta _site/ pronta para publicar.
#
#   bash build.sh                      prévia sem URLs absolutas
#   SITE_URL=https://exemplo.com.br bash build.sh
#                                      prévia com canonical/OG/JSON-LD
#   SITE_URL=https://exemplo.com.br INDEXAR=sim bash build.sh
#                                      versão definitiva: index,follow + sitemap
#
# No Netlify o endereço vem sozinho ($URL em produção, $DEPLOY_PRIME_URL em
# prévias de branch). Sem endereço conhecido, o bloco de URLs absolutas é
# removido: nada de domínio inventado.
# ==========================================================================
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Copiando os arquivos do site"
rm -rf _site
mkdir -p _site
cp -r index.html favicon.svg robots.txt css js fonts img _site/
rm -f _site/img/relatorio.json

if [ -n "${SITE_URL:-}" ]; then
  ENDERECO="$SITE_URL"
elif [ "${CONTEXT:-}" = "production" ] && [ -n "${URL:-}" ]; then
  ENDERECO="$URL"
else
  ENDERECO="${DEPLOY_PRIME_URL:-}"
fi
ENDERECO="${ENDERECO%/}"

if [ -n "$ENDERECO" ]; then
  echo "==> URLs absolutas apontando para $ENDERECO"
  sed -i "s#__SITE_URL__#${ENDERECO}#g" _site/index.html
else
  echo "==> Sem endereço definido: removendo canonical, og:url, og:image e JSON-LD"
  sed -i '/<!-- seo-url:inicio -->/,/<!-- seo-url:fim -->/d' _site/index.html
fi

if [ "${INDEXAR:-nao}" = "sim" ]; then
  if [ -z "$ENDERECO" ]; then
    echo "ERRO: INDEXAR=sim exige SITE_URL (domínio definitivo)." >&2
    exit 1
  fi
  echo "==> Versão indexável: index,follow e sitemap.xml"
  sed -i 's#<meta name="robots" content="noindex, follow">#<meta name="robots" content="index, follow">#' _site/index.html
  cat > _site/sitemap.xml <<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ENDERECO}/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
  </url>
</urlset>
XML
  printf '\nSitemap: %s/sitemap.xml\n' "$ENDERECO" >> _site/robots.txt
else
  echo "==> Prévia: noindex,follow mantido, sem sitemap"
fi

if grep -q "__SITE_URL__" _site/index.html; then
  echo "ERRO: sobrou __SITE_URL__ no HTML." >&2
  exit 1
fi

echo "==> Pronto"
du -sh _site
