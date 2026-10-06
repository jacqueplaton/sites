#!/usr/bin/env bash
# ==========================================================================
# Gera o pacote de deploy da prévia: terra-dourada-deploy.zip
# --------------------------------------------------------------------------
# - Copia só os arquivos do site (deixa README e este script de fora).
# - Por padrão o pacote abre no modo CLIENTE (sem marcações de revisão),
#   porque um link publicado tende a ser compartilhado. A equipe vê as
#   marcações acrescentando ?modo=revisao ao endereço.
#   Para gerar com revisão por padrão:  ./empacotar.sh revisao
# - O zip tem os arquivos na raiz: serve para Netlify Drop, Cloudflare
#   Pages, Hostinger/cPanel (extrair em public_html) ou qualquer host
#   estático. Todos os caminhos são relativos, então também funciona
#   dentro de uma subpasta.
#
# Uso:  ./empacotar.sh [cliente|revisao] [pasta-de-saida]
# ==========================================================================
set -euo pipefail

MODO="${1:-cliente}"
SAIDA="${2:-.}"
case "$MODO" in cliente|revisao) ;; *) echo "modo inválido: $MODO (use cliente ou revisao)" >&2; exit 1 ;; esac

ORIGEM="$(cd "$(dirname "$0")" && pwd)"
SAIDA="$(mkdir -p "$SAIDA" && cd "$SAIDA" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$TMP/site"
cp -r "$ORIGEM/index.html" "$ORIGEM/favicon.svg" "$ORIGEM/_headers" \
      "$ORIGEM/css" "$ORIGEM/js" "$ORIGEM/fonts" "$ORIGEM/media" "$TMP/site/"

# Define o modo padrão do pacote (só na cópia; o repositório não muda).
sed -i "s/^  modo: '[a-z]*',/  modo: '$MODO',/" "$TMP/site/js/config.js"
grep -q "^  modo: '$MODO'," "$TMP/site/js/config.js" || { echo "não consegui ajustar o modo em js/config.js" >&2; exit 1; }

ZIP="$SAIDA/terra-dourada-deploy.zip"
rm -f "$ZIP"
(cd "$TMP/site" && zip -qr -X "$ZIP" .)

echo "Pacote: $ZIP"
echo "Modo padrão: $MODO"
du -h "$ZIP" | cut -f1
unzip -l "$ZIP" | tail -1
