#!/usr/bin/env bash
# ==========================================================================
# Confere se os links externos citados no site ainda estão no ar.
#
#   bash ferramentas/checar-links.sh
#
# Link de fonte quebrado é um dos jeitos mais silenciosos de o conteúdo
# envelhecer: a página continua bonita e a citação deixa de valer. Rode isto
# em toda revisão semestral, junto com atualizar-datas.sh.
#
# Precisa de internet. Em ambientes com saída de rede restrita, todos os
# endereços aparecem como falha — isso é a rede, não o site.
# ==========================================================================
set -uo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RAIZ="$(dirname "$AQUI")"
cd "$RAIZ"

echo "Conferindo os links externos citados nas páginas..."
echo

URLS="$(grep -rhoE 'href="https?://[^"]+"' --include='*.html' . \
        | sed -E 's/^href="//; s/"$//' \
        | sort -u)"

total=0
falhas=0

while IFS= read -r url; do
  [ -z "$url" ] && continue
  total=$((total + 1))
  codigo="$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 25 \
              -A 'Mozilla/5.0 (compatible; verificador-de-links)' "$url" 2>/dev/null \
            || echo '000')"
  case "$codigo" in
    2*|3*) printf '  ok    %s  %s\n' "$codigo" "$url" ;;
    403|405|429)
      # Vários sites recusam robô mas respondem normalmente no navegador.
      printf '  ver   %s  %s  (abra no navegador para confirmar)\n' "$codigo" "$url" ;;
    *)
      printf '  FALHA %s  %s\n' "$codigo" "$url"
      falhas=$((falhas + 1)) ;;
  esac
done <<< "$URLS"

echo
echo "$total endereço(s) conferido(s), $falhas falha(s)."
[ "$falhas" -eq 0 ] || echo "Corrija ou troque as fontes com falha antes de atualizar a data de revisão."
exit 0
