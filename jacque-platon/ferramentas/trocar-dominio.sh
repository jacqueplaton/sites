#!/usr/bin/env bash
# ==========================================================================
# Troca o domínio do site em TODOS os lugares de uma vez.
#
#   bash ferramentas/trocar-dominio.sh https://jacqueplatonmkt.com.br
#
# O domínio fica guardado em um só lugar (ferramentas/gerar.py). Este script
# muda essa linha, gera as páginas de novo e roda a verificação. Canonical,
# sitemap, robots.txt, Open Graph e JSON-LD saem todos com o novo endereço.
# ==========================================================================
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Uso: bash ferramentas/trocar-dominio.sh https://seudominio.com.br" >&2
  exit 2
fi

NOVO="${1%/}"

case "$NOVO" in
  https://*) ;;
  http://*)
    echo "Aviso: use https. Buscadores tratam http como endereço inferior." >&2
    ;;
  *)
    echo "Erro: o domínio precisa começar com https:// — recebido: $NOVO" >&2
    exit 2
    ;;
esac

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RAIZ="$(dirname "$AQUI")"

ANTIGO="$(python3 - "$AQUI/gerar.py" <<'PY'
import re, sys
texto = open(sys.argv[1], encoding="utf-8").read()
print(re.search(r'^DOMINIO = "([^"]+)"', texto, re.M).group(1))
PY
)"

if [ "$ANTIGO" = "$NOVO" ]; then
  echo "O domínio já é $NOVO. Nada a trocar."
else
  python3 - "$AQUI/gerar.py" "$NOVO" <<'PY'
import re, sys
caminho, novo = sys.argv[1], sys.argv[2]
texto = open(caminho, encoding="utf-8").read()
texto = re.sub(r'^DOMINIO = "[^"]+"', 'DOMINIO = "%s"' % novo, texto, count=1, flags=re.M)
open(caminho, "w", encoding="utf-8").write(texto)
PY
  echo "Domínio: $ANTIGO  ->  $NOVO"
fi

cd "$RAIZ"
python3 ferramentas/gerar.py
echo
python3 ferramentas/verificar.py

cat <<'FIM'

Depois de publicar no novo domínio, faça estes três passos à mão:

  1. Google Search Console: adicionar a propriedade do novo domínio e enviar
     o sitemap.xml.
  2. Bing Webmaster Tools: mesma coisa.
  3. Se o site já estava em outro endereço, configurar redirecionamento 301
     do antigo para o novo na hospedagem.
FIM
