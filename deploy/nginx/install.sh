#!/bin/bash
# Cài Nginx — chỉ lanhdao.gamegiaoduc.co (CMS tại /admin1111)
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

[[ -d "$APP_ROOT" ]] || { echo "Thiếu $APP_ROOT"; exit 1; }

mkdir -p "$SNIPPETS_DIR" "$CONF_D_DIR" "$APP_ROOT/public/certbot" \
  "$APP_ROOT/data" "$APP_ROOT/public/uploads"
chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null \
  || chmod -R a+rwX "$APP_ROOT/data" "$APP_ROOT/public/uploads"

cp "$SCRIPT_DIR/conf.d/lanhdao-upstream.conf" "$CONF_D_DIR/lanhdao-upstream.conf"
cp "$SCRIPT_DIR/cloudflare.conf" "$SNIPPETS_DIR/cloudflare-realip.conf"
cp "$SCRIPT_DIR/snippets/lanhdao-proxy.conf" "$SNIPPETS_DIR/lanhdao-proxy.conf"
cp "$SCRIPT_DIR/snippets/lanhdao-locations.conf" "$SNIPPETS_DIR/lanhdao-locations.conf"

if [[ -f "$CERT_PATH" ]]; then
  cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.conf" "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf"
else
  cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.bootstrap.conf" "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf"
fi

ln -sf "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf" "$SITES_ENABLED/lanhdao.gamegiaoduc.co.conf"
rm -f "$SITES_ENABLED/admin.lanhdao.gamegiaoduc.co.conf" 2>/dev/null || true

nginx -t && systemctl reload nginx

echo "OK — Nginx: https://lanhdao.gamegiaoduc.co"
echo "CMS:     https://lanhdao.gamegiaoduc.co/admin1111/login"
[[ ! -f "$CERT_PATH" ]] && echo "Bật 443: sudo bash $APP_ROOT/deploy/nginx/enable-ssl.sh"
