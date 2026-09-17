#!/usr/bin/env bash
# ==========================================================================
# Build do site "Marido de aluguel" para o Netlify
# --------------------------------------------------------------------------
# Faz duas coisas:
#   1. separa numa pasta _site apenas os arquivos que vão para o ar
#      (deixa de fora o README e este próprio script);
#   2. troca o endereço provisório das tags de SEO pelo endereço real que o
#      Netlify atribuiu, para canonical, Open Graph, robots.txt e sitemap.xml
#      não ficarem apontando para o lugar errado.
#
# O Netlify define $URL sozinho (ex.: https://seu-site.netlify.app). Rodando
# fora do Netlify, o script não mexe nas URLs.
# ==========================================================================
set -euo pipefail

# Endereço provisório que está escrito no index.html e no sitemap.xml.
# Se o site ganhar domínio próprio, troque nos arquivos e aqui.
PROVISORIO="https://exemplo.com.br"

echo "==> Separando os arquivos do site"
rm -rf _site
mkdir -p _site
cp -r index.html favicon.svg robots.txt sitemap.xml css js fonts media _site/

# Deploys de produção usam $URL; previews de branch e de pull request usam
# $DEPLOY_PRIME_URL, que aponta para aquele deploy específico.
DESTINO="${DEPLOY_PRIME_URL:-${URL:-}}"

if [ -n "$DESTINO" ]; then
  DESTINO="${DESTINO%/}"           # tira a barra final, se houver
  echo "==> Ajustando as URLs de SEO para $DESTINO"
  find _site -type f \( -name '*.html' -o -name '*.xml' -o -name '*.txt' \) \
    -exec sed -i "s#${PROVISORIO}#${DESTINO}#g" {} +
else
  echo "==> Fora do Netlify: mantendo as URLs como estão"
fi

# Aviso, não erro: o site sobe com os espaços reservados se faltar alguma foto.
echo "==> Conferindo as fotos dos serviços"
for foto in montagem-moveis eletrica hidraulica pintura; do
  if [ ! -f "_site/media/${foto}.jpg" ]; then
    echo "    AVISO: media/${foto}.jpg não está na pasta — vai aparecer o espaço reservado."
  fi
done

echo "==> Pronto"
du -sh _site
find _site -type f | wc -l
