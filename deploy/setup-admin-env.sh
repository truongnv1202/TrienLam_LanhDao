#!/bin/bash
# Tạo / cập nhật ADMIN_PASSWORD và ADMIN_SESSION_SECRET trên server
# Chạy: sudo bash /opt/TrienLam_LanhDao/deploy/setup-admin-env.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$APP_ROOT/deploy/env.server"
EXAMPLE="$APP_ROOT/deploy/env.server.example"

bash "$SCRIPT_DIR/ensure-env.sh"

if [[ $EUID -ne 0 ]] && [[ ! -w "$(dirname "$ENV_FILE")" ]]; then
  echo "Chạy với sudo hoặc quyền ghi $ENV_FILE"
  exit 1
fi

# Đảm bảo APP_ROOT / APP_PORT
grep -q '^APP_ROOT=' "$ENV_FILE" || echo 'APP_ROOT=/opt/TrienLam_LanhDao' >>"$ENV_FILE"
grep -q '^APP_PORT=' "$ENV_FILE" || echo 'APP_PORT=5006' >>"$ENV_FILE"

generate_secret() {
  if command -v openssl >/dev/null; then
    openssl rand -hex 32
  else
    head -c 32 /dev/urandom | xxd -p -c 64 | head -c 64
  fi
}

update_var() {
  local key="$1"
  local val="$2"
  local tmp="${ENV_FILE}.tmp.$$"
  grep -v "^${key}=" "$ENV_FILE" >"$tmp" 2>/dev/null || true
  echo "${key}=${val}" >>"$tmp"
  mv "$tmp" "$ENV_FILE"
}

CURRENT_PW=$(grep '^ADMIN_PASSWORD=' "$ENV_FILE" | cut -d= -f2- || true)
CURRENT_SECRET=$(grep '^ADMIN_SESSION_SECRET=' "$ENV_FILE" | cut -d= -f2- || true)

if [[ -n "${ADMIN_PASSWORD_INPUT:-}" ]]; then
  NEW_PW="$ADMIN_PASSWORD_INPUT"
elif [[ ${#CURRENT_PW} -ge 6 ]]; then
  echo "Giữ nguyên ADMIN_PASSWORD hiện tại."
  NEW_PW="$CURRENT_PW"
else
  echo ""
  echo "Đặt mật khẩu đăng nhập CMS (/admin1111/login)"
  read -r -s -p "ADMIN_PASSWORD (tối thiểu 6 ký tự): " NEW_PW
  echo ""
  if [[ ${#NEW_PW} -lt 6 ]]; then
    echo "Mật khẩu quá ngắn."
    exit 1
  fi
fi

if [[ ${#CURRENT_SECRET} -ge 16 ]]; then
  echo "Giữ nguyên ADMIN_SESSION_SECRET hiện tại."
  NEW_SECRET="$CURRENT_SECRET"
else
  NEW_SECRET=$(generate_secret)
  echo "Đã tạo ADMIN_SESSION_SECRET mới (64 ký tự hex)."
fi

update_var "APP_ROOT" "$APP_ROOT"
update_var "APP_PORT" "5006"
update_var "ADMIN_PASSWORD" "$NEW_PW"
update_var "ADMIN_SESSION_SECRET" "$NEW_SECRET"

chmod 600 "$ENV_FILE"

echo ""
echo "Đã lưu: $ENV_FILE"
echo ""
echo "Khởi động lại Docker để áp dụng:"
echo "  cd $APP_ROOT && docker compose --env-file deploy/env.server up -d"
echo ""
echo "Đăng nhập tại: https://lanhdao.gamegiaoduc.co/admin1111/login"
