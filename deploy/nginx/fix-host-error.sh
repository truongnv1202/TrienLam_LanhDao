#!/bin/bash
# Sửa Host Error 502 — sudo bash /opt/TrienLam_LanhDao/deploy/nginx/fix-host-error.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERT="/etc/letsencrypt/live/lanhdao.gamegiaoduc.co/fullchain.pem"

echo "=== Docker ==="
curl -sf http://127.0.0.1:5006/api/health || { echo "Lỗi: Docker chưa chạy"; exit 1; }
echo " OK"

HAS_SSL=0
[[ -f "$CERT" ]] && HAS_SSL=1

cp "$SCRIPT_DIR/conf.d/lanhdao-upstream.conf" /etc/nginx/conf.d/lanhdao-upstream.conf
cp "$SCRIPT_DIR/snippets/lanhdao-proxy.conf" /etc/nginx/snippets/lanhdao-proxy.conf
cp "$SCRIPT_DIR/snippets/lanhdao-locations.conf" /etc/nginx/snippets/lanhdao-locations.conf

if [[ "$HAS_SSL" -eq 1 ]]; then
  cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.conf" /etc/nginx/sites-available/lanhdao.gamegiaoduc.co.conf
else
  cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.bootstrap.conf" /etc/nginx/sites-available/lanhdao.gamegiaoduc.co.conf
fi

ln -sf /etc/nginx/sites-available/lanhdao.gamegiaoduc.co.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/admin.lanhdao.gamegiaoduc.co.conf 2>/dev/null || true

nginx -t && systemctl reload nginx

echo "OK — https://lanhdao.gamegiaoduc.co/admin1111/login"
