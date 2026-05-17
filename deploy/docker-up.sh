#!/bin/bash
# Khởi động Docker — tự tạo deploy/env.server nếu thiếu
#   bash deploy/docker-up.sh
#   bash deploy/docker-up.sh --build
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$APP_ROOT"

bash "$SCRIPT_DIR/ensure-env.sh"

ENV_FILE="$APP_ROOT/deploy/env.server"
PW=$(grep '^ADMIN_PASSWORD=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- || true)
SECRET=$(grep '^ADMIN_SESSION_SECRET=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- || true)

if [[ ${#PW} -lt 6 ]] || [[ ${#SECRET} -lt 16 ]]; then
  echo ""
  echo "Chưa cấu hình mật khẩu admin. Chạy:"
  echo "  sudo bash $APP_ROOT/deploy/setup-admin-env.sh"
  echo ""
  exit 1
fi

docker compose --env-file "$ENV_FILE" up -d "$@"
