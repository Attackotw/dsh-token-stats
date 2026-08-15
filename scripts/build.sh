#!/bin/bash
# Build @dsh-external/dsh-token-stats: compile src/ → lib/ with the local
# typescript (node_modules junction). Client half is built separately via
# `npm run build:client` (tsdown). No DSH monorepo checkout required.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TSC="$ROOT/node_modules/typescript/bin/tsc"
if [ ! -f "$TSC" ]; then
  echo "build: typescript not found at $TSC (link node_modules or npm install)" >&2
  exit 1
fi

echo "=== Compiling src → lib (tsc $(node "$TSC" --version)) ==="
node "$TSC" -p tsconfig.json

echo "=== Build complete ==="
ls -la lib/ lib/types/ 2>/dev/null || true
