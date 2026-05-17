#!/bin/bash
# Cài Nginx cho lanhdao.gamegiaoduc.co
# Chạy từ server: sudo bash /opt/TrienLam_LanhDao/deploy/nginx/install.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SNIPPETS_DIR="/etc/nginx/snippets"
SITES_AVAILABLE="/etc/nginx/sites-available"
SITES_ENABLED="/etc/nginx/sites-enabled"
SITE_NAME="lanhdao.gamegiaoduc.co.conf"

if [[ $EUID -ne 0 ]]; then
  echo "Chạy với sudo: sudo bash $APP_ROOT/deploy/nginx/install.sh"
  exit 1
fi

if [[ ! -d "$APP_ROOT" ]]; then
  echo "Thiếu thư mục $APP_ROOT — hãy đặt mã nguồn vào /opt/TrienLam_LanhDao trước."
  exit 1
fi

mkdir -p "$SNIPPETS_DIR" "$APP_ROOT/public/certbot" "$APP_ROOT/data" "$APP_ROOT/public/uploads/portraits"

chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null \
  || chmod -R a+rwX "$APP_ROOT/data" "$APP_ROOT/public/uploads"

cp "$SCRIPT_DIR/cloudflare.conf" "$SNIPPETS_DIR/cloudflare-realip.conf"
cp "$SCRIPT_DIR/snippets/lanhdao-proxy.conf" "$SNIPPETS_DIR/lanhdao-proxy.conf"
cp "$SCRIPT_DIR/$SITE_NAME" "$SITES_AVAILABLE/$SITE_NAME"

ln -sf "$SITES_AVAILABLE/$SITE_NAME" "$SITES_ENABLED/$SITE_NAME"

if ! nginx -t; then
  echo "LỖI cấu hình Nginx. Sửa file rồi chạy lại: sudo nginx -t"
  exit 1
fi

systemctl reload nginx

echo "OK — Nginx đã load $SITE_NAME"
echo "App root: $APP_ROOT"
echo "Kiểm tra:"
echo "  curl -s http://127.0.0.1:5006/api/health"
echo "  curl -I -H 'Host: lanhdao.gamegiaoduc.co' http://127.0.0.1/"
