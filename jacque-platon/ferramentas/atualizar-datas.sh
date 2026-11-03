#!/usr/bin/env bash
# ==========================================================================
# Marca o site como revisado hoje (ou em uma data informada).
#
#   bash ferramentas/atualizar-datas.sh              # hoje
#   bash ferramentas/atualizar-datas.sh 2027-05-10   # data específica
#
# Isto muda a data de ÚLTIMA REVISÃO: o texto "Última revisão em" de cada
# página, o dateModified do JSON-LD e o lastmod do sitemap.xml. A data de
# publicação original não é alterada.
#
# Use só depois de ter realmente revisado o conteúdo. Mudar a data sem mudar
# nada não melhora nada e engana quem lê.
# ==========================================================================
set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RAIZ="$(dirname "$AQUI")"
DATA="${1:-$(date +%F)}"

if ! printf '%s' "$DATA" | grep -Eq '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; then
  echo "Erro: data fora do formato AAAA-MM-DD — recebido: $DATA" >&2
  exit 2
fi

python3 - "$AQUI/gerar.py" "$DATA" <<'PY'
import re, sys
caminho, data = sys.argv[1], sys.argv[2]
texto = open(caminho, encoding="utf-8").read()
novo = re.sub(r'^ATUALIZADO = "[^"]+"', 'ATUALIZADO = "%s"' % data,
              texto, count=1, flags=re.M)
if novo == texto:
    sys.exit("Não encontrei a linha ATUALIZADO em %s" % caminho)
open(caminho, "w", encoding="utf-8").write(novo)
PY

echo "Última revisão do site: $DATA"
cd "$RAIZ"
python3 ferramentas/gerar.py
echo
python3 ferramentas/verificar.py

cat <<'FIM'

Lembrete da política de revisão (está no README.md):

  * Revisar o conteúdo a cada seis meses, no mínimo.
  * Conferir preço, serviço oferecido, canal de contato e links externos.
  * Corrigir ou remover o que estiver desatualizado ANTES de mudar a data.
  * Na página /pesquisa/, acrescentar a nova observação ao histórico de
    revisões em vez de apagar a anterior.
FIM
