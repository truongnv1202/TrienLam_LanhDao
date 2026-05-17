#!/bin/bash
# Cài Nginx — tự chọn bootstrap (chưa SSL) hoặc production (đã có cert + cổng 443)
# sudo bash /opt/TrienLam_LanhDao/deploy/nginx/install.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SNIPPETS_DIR="/etc/nginx/snippets"
CONF_D_DIR="/etc/nginx/conf.d"
SITES_AVAILABLE="/etc/nginx/sites-available"
SITES_ENABLED="/etc/nginx/sites-enabled"
CERT_PATH="/etc/letsencrypt/live/lanhdao.gamegiaoduc.co/fullchain.pem"

if [[ $EUID -ne 0 ]]; then
  echo "Chạy với sudo: sudo bash $APP_ROOT/deploy/nginx/install.sh"
  exit 1
fi

if [[ ! -d "$APP_ROOT" ]]; then
  echo "Thiếu $APP_ROOT"
  exit 1
fi

mkdir -p "$SNIPPETS_DIR" "$CONF_D_DIR" "$APP_ROOT/public/certbot" \
  "$APP_ROOT/data" "$APP_ROOT/public/uploads/portraits"
chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null \
  || chmod -R a+rwX "$APP_ROOT/data" "$APP_ROOT/public/uploads"

cp "$SCRIPT_DIR/conf.d/lanhdao-upstream.conf" "$CONF_D_DIR/lanhdao-upstream.conf"
cp "$SCRIPT_DIR/cloudflare.conf" "$SNIPPETS_DIR/cloudflare-realip.conf"
cp "$SCRIPT_DIR/snippets/lanhdao-proxy.conf" "$SNIPPETS_DIR/lanhdao-proxy.conf"
cp "$SCRIPT_DIR/snippets/lanhdao-locations.conf" "$SNIPPETS_DIR/lanhdao-locations.conf"

if [[ -f "$CERT_PATH" ]]; then
  echo "Đã có SSL — cài config có cổng 443..."
  cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.conf" \
    "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf"
  cp "$SCRIPT_DIR/admin.lanhdao.gamegiaoduc.co.conf" \
    "$SITES_AVAILABLE/admin.lanhdao.gamegiaoduc.co.conf"
else
  echo "Chưa có SSL — cài bootstrap HTTP (chạy enable-ssl.sh để bật 443)..."
  cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.bootstrap.conf" \
    "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf"
  cp "$SCRIPT_DIR/admin.lanhdao.gamegiaoduc.co.bootstrap.conf" \
    "$SITES_AVAILABLE/admin.lanhdao.gamegiaoduc.co.conf"
fi

ln -sf "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf" \
  "$SITES_ENABLED/lanhdao.gamegiaoduc.co.conf"
ln -sf "$SITES_AVAILABLE/admin.lanhdao.gamegiaoduc.co.conf" \
  "$SITES_ENABLED/admin.lanhdao.gamegiaoduc.co.conf"

if ! nginx -t; then
  echo "LỖI nginx -t. Nếu thiếu cert mà đã copy bản 443: sudo bash deploy/nginx/enable-ssl.sh"
  exit 1
fi

systemctl reload nginx

echo "OK — Nginx đã reload."
if [[ ! -f "$CERT_PATH" ]]; then
  echo "Bật cổng 443: sudo bash $APP_ROOT/deploy/nginx/enable-ssl.sh"
fi
