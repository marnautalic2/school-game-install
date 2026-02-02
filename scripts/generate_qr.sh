#!/usr/bin/env bash
set -euo pipefail

URL="${1:-}"
if [[ -z "$URL" ]]; then
  echo "Usage: scripts/generate_qr.sh https://your-landing-url"
  exit 1
fi

PYTHON_BIN=""
if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
else
  echo "Python is required to URL-encode the link."
  exit 1
fi

ENCODED=$($PYTHON_BIN - <<'PY'
import sys
from urllib.parse import quote
print(quote(sys.argv[1], safe=""))
PY
"$URL")

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
OUT="$ROOT_DIR/assets/qr.png"
mkdir -p "$(dirname "$OUT")"

curl -L -o "$OUT" "https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=$ENCODED"

echo "Saved $OUT"
