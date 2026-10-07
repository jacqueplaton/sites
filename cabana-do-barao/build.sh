#!/usr/bin/env bash
# ==========================================================================
# Build da Cabana do Barão
# --------------------------------------------------------------------------
# Monta a pasta _site só com os arquivos públicos (deixa de fora README,
# _originais e este script) e ajusta endereços absolutos de SEO.
#
# Variáveis:
#   SITE_URL     endereço do site, ex.: https://www.cabanadobarao.com.br
#                No Netlify, se não for definido, usa o endereço do deploy.
#   INDEXAR=sim  libera os buscadores: retira o noindex e cria canonical,
#                og:url, "url" no JSON-LD, sitemap.xml e a linha Sitemap do
#                robots.txt. Use SOMENTE com o domínio final definido.
#
# Exemplos:
#   bash build.sh                                   # prévia (noindex)
#   SITE_URL=https://dominio.com.br INDEXAR=sim bash build.sh
# ==========================================================================
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Separando os arquivos do site"
rm -rf _site
mkdir -p _site
cp -r index.html favicon.svg robots.txt css js fonts media _site/

BASE="${SITE_URL:-${DEPLOY_PRIME_URL:-${URL:-}}}"
BASE="${BASE%/}"

if [ -n "$BASE" ]; then
  echo "==> Endereços absolutos de Open Graph e JSON-LD: $BASE"
  sed -i \
    -e "s#\"\./media/#\"$BASE/media/#g" \
    -e "s#\"\./\#cabana-do-barao\"#\"$BASE/\#cabana-do-barao\"#g" \
    _site/index.html
fi

if [ "${INDEXAR:-}" = "sim" ]; then
  if [ -z "${SITE_URL:-}" ]; then
    echo "ERRO: INDEXAR=sim exige SITE_URL com o domínio final." >&2
    exit 1
  fi
  echo "==> Liberando indexação para $BASE"
  sed -i '/<meta name="robots" content="noindex, nofollow">/d' _site/index.html
  sed -i "s#^<meta name=\"theme-color\"#<link rel=\"canonical\" href=\"$BASE/\">\n<meta property=\"og:url\" content=\"$BASE/\">\n&#" _site/index.html
  sed -i "s#^  \"@id\": \"$BASE/\#cabana-do-barao\",#&\n  \"url\": \"$BASE/\",#" _site/index.html
  HOJE="$(date +%Y-%m-%d)"
  cat > _site/sitemap.xml <<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>$BASE/</loc>
    <lastmod>$HOJE</lastmod>
  </url>
</urlset>
XML
  printf '\nSitemap: %s/sitemap.xml\n' "$BASE" >> _site/robots.txt
else
  echo "==> Prévia: mantendo noindex (meta e cabeçalho X-Robots-Tag)"
  printf '/*\n  X-Robots-Tag: noindex, nofollow\n' > _site/_headers
fi

echo "==> Pronto"
du -sh _site
