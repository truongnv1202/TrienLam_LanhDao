#!/bin/bash
# Cài Nginx — chỉ lanhdao2.gamegiaoduc.co (CMS tại /admin1111)
# sudo bash /opt/TrienLam_LanhDao_v2/deploy/nginx/install.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao_v2"
DOMAIN="lanhdao2.gamegiaoduc.co"
OLD_DOMAIN="lanhdao.gamegiaoduc.co"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SNIPPETS_DIR="/etc/nginx/snippets"
CONF_D_DIR="/etc/nginx/conf.d"
SITES_AVAILABLE="/etc/nginx/sites-available"
SITES_ENABLED="/etc/nginx/sites-enabled"
SITE_CONF="$DOMAIN.conf"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

if [[ $EUID -ne 0 ]]; then
  echo "Chạy với sudo: sudo bash $APP_ROOT/deploy/nginx/install.sh"
  exit 1
fi

[[ -d "$APP_ROOT" ]] || { echo "Thiếu $APP_ROOT"; exit 1; }

mkdir -p "$SNIPPETS_DIR" "$CONF_D_DIR" "$APP_ROOT/public/certbot" \
  "$APP_ROOT/data" "$APP_ROOT/public/uploads" "$APP_ROOT/public/fonts"
chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null \
  || chmod -R a+rwX "$APP_ROOT/data" "$APP_ROOT/public/uploads"

cp "$SCRIPT_DIR/conf.d/lanhdao2-upstream.conf" "$CONF_D_DIR/lanhdao2-upstream.conf"
cp "$SCRIPT_DIR/cloudflare.conf" "$SNIPPETS_DIR/cloudflare-realip.conf"
cp "$SCRIPT_DIR/snippets/lanhdao2-proxy.conf" "$SNIPPETS_DIR/lanhdao2-proxy.conf"
cp "$SCRIPT_DIR/snippets/lanhdao2-locations.conf" "$SNIPPETS_DIR/lanhdao2-locations.conf"

if [[ -f "$CERT_PATH" ]]; then
  cp "$SCRIPT_DIR/$DOMAIN.conf" "$SITES_AVAILABLE/$SITE_CONF"
else
  cp "$SCRIPT_DIR/$DOMAIN.bootstrap.conf" "$SITES_AVAILABLE/$SITE_CONF"
fi

ln -sf "$SITES_AVAILABLE/$SITE_CONF" "$SITES_ENABLED/$SITE_CONF"
rm -f "$SITES_ENABLED/$OLD_DOMAIN.conf" "$SITES_ENABLED/admin.$OLD_DOMAIN.conf" 2>/dev/null || true

nginx -t && systemctl reload nginx

echo "OK — Nginx: https://$DOMAIN"
echo "CMS:     https://$DOMAIN/admin1111/login"
[[ ! -f "$CERT_PATH" ]] && echo "Bật 443: sudo bash $APP_ROOT/deploy/nginx/enable-ssl.sh"
