#!/usr/bin/env bash
# Descobre o Python do projeto: prefere o .venv, cai no python3 do sistema.
set -euo pipefail
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -x "$RAIZ/.venv/bin/python" ]; then
  PY="$RAIZ/.venv/bin/python"
else
  PY="$(command -v python3)"
fi
cd "$RAIZ"
