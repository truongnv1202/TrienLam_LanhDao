#!/bin/bash
# Khởi tạo thư mục /opt/TrienLam_LanhDao trên server (chạy 1 lần)
# Usage: sudo bash deploy/setup-opt.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao"
APP_USER="${SUDO_USER:-$(whoami)}"

if [[ $EUID -ne 0 ]]; then
  echo "Chạy với sudo."
  exit 1
fi

mkdir -p \
  "$APP_ROOT" \
  "$APP_ROOT/data" \
  "$APP_ROOT/public/uploads/portraits" \
  "$APP_ROOT/public/certbot" \
  "$APP_ROOT/public/videos" \
  "$APP_ROOT/public/images"

chown -R "$APP_USER:$APP_USER" "$APP_ROOT"
chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null || true

echo "Đã tạo $APP_ROOT"
echo "Copy mã nguồn vào $APP_ROOT rồi chạy 1 lệnh:"
echo "  sudo bash $APP_ROOT/deploy/server-up.sh"
