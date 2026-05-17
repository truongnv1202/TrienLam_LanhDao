#!/bin/bash
# Tạo deploy/env.server nếu chưa có (không ghi đè file đã tồn tại)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$APP_ROOT/deploy/env.server"
EXAMPLE="$APP_ROOT/deploy/env.server.example"

mkdir -p "$(dirname "$ENV_FILE")"

if [[ -f "$ENV_FILE" ]]; then
  exit 0
fi

if [[ -f "$EXAMPLE" ]]; then
  cp "$EXAMPLE" "$ENV_FILE"
  echo "Đã tạo $ENV_FILE từ env.server.example"
else
  cat >"$ENV_FILE" <<'EOF'
APP_ROOT=/opt/TrienLam_LanhDao
APP_PORT=5006
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
EOF
  echo "Đã tạo $ENV_FILE (mặc định)"
fi

chmod 600 "$ENV_FILE" 2>/dev/null || true
