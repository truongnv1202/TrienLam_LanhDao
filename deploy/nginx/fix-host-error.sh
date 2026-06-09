#!/bin/bash
# Sửa Host Error 502 — sudo bash /opt/TrienLam_LanhDao_v2/deploy/nginx/fix-host-error.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao_v2"
DOMAIN="lanhdao.gamegiaoduc.co"
OLD_DOMAIN="lanhdao2.gamegiaoduc.co"
APP_PORT="5007"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_CONF="$DOMAIN.conf"
CERT="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

echo "=== Docker ==="
curl -sf "http://127.0.0.1:$APP_PORT/api/health" || { echo "Lỗi: Docker chưa chạy trên cổng $APP_PORT"; exit 1; }
echo " OK"

HAS_SSL=0
[[ -f "$CERT" ]] && HAS_SSL=1

cp "$SCRIPT_DIR/conf.d/lanhdao2-upstream.conf" /etc/nginx/conf.d/lanhdao2-upstream.conf
cp "$SCRIPT_DIR/snippets/lanhdao2-proxy.conf" /etc/nginx/snippets/lanhdao2-proxy.conf
cp "$SCRIPT_DIR/snippets/lanhdao2-locations.conf" /etc/nginx/snippets/lanhdao2-locations.conf

if [[ "$HAS_SSL" -eq 1 ]]; then
  cp "$SCRIPT_DIR/$DOMAIN.conf" "/etc/nginx/sites-available/$SITE_CONF"
else
  cp "$SCRIPT_DIR/$DOMAIN.bootstrap.conf" "/etc/nginx/sites-available/$SITE_CONF"
fi

ln -sf "/etc/nginx/sites-available/$SITE_CONF" "/etc/nginx/sites-enabled/$SITE_CONF"
rm -f "/etc/nginx/sites-enabled/$OLD_DOMAIN.conf" "/etc/nginx/sites-enabled/admin.$DOMAIN.conf" "/etc/nginx/sites-enabled/admin.$OLD_DOMAIN.conf" 2>/dev/null || true

nginx -t && systemctl reload nginx

echo "OK — https://$DOMAIN/admin1111/login"
