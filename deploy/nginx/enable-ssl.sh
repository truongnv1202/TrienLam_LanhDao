#!/bin/bash
# Cài SSL Let's Encrypt + bật Nginx cổng 443
# Chạy: sudo bash /opt/TrienLam_LanhDao/deploy/nginx/enable-ssl.sh
#        sudo CERTBOT_EMAIL=admin@gamegiaoduc.co bash deploy/nginx/enable-ssl.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao"
DOMAIN="lanhdao.gamegiaoduc.co"
EMAIL="${CERTBOT_EMAIL:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SNIPPETS_DIR="/etc/nginx/snippets"
SITES_AVAILABLE="/etc/nginx/sites-available"
SITES_ENABLED="/etc/nginx/sites-enabled"
SITE_NAME="lanhdao.gamegiaoduc.co.conf"

if [[ $EUID -ne 0 ]]; then
  echo "Chạy với sudo."
  exit 1
fi

if [[ ! -d "$APP_ROOT" ]]; then
  echo "Thiếu $APP_ROOT"
  exit 1
fi

echo "==> Kiểm tra Docker app (cổng 5006)..."
if ! curl -sf "http://127.0.0.1:5006/api/health" >/dev/null; then
  echo "App chưa chạy. Chạy trước: cd $APP_ROOT && docker compose --env-file deploy/env.server up -d"
  exit 1
fi

echo "==> Cài Certbot (nếu chưa có)..."
if ! command -v certbot >/dev/null; then
  apt-get update -qq
  apt-get install -y certbot
fi

mkdir -p "$APP_ROOT/public/certbot" "$SNIPPETS_DIR"
chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null || true

echo "==> Cài cấu hình HTTP tạm (cho ACME challenge)..."
cp "$SCRIPT_DIR/snippets/lanhdao-proxy.conf" "$SNIPPETS_DIR/lanhdao-proxy.conf"
cp "$SCRIPT_DIR/snippets/lanhdao-locations.conf" "$SNIPPETS_DIR/lanhdao-locations.conf"
cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.conf" "$SITES_AVAILABLE/$SITE_NAME"
ln -sf "$SITES_AVAILABLE/$SITE_NAME" "$SITES_ENABLED/$SITE_NAME"
nginx -t && systemctl reload nginx

echo "==> Lấy chứng chỉ Let's Encrypt..."
CERTBOT_ARGS=(
  certonly
  --webroot
  -w "$APP_ROOT/public/certbot"
  -d "$DOMAIN"
  --agree-tos
  --non-interactive
  --keep-until-expiring
)
if [[ -n "$EMAIL" ]]; then
  CERTBOT_ARGS+=(--email "$EMAIL")
else
  CERTBOT_ARGS+=(--register-unsafely-without-email)
fi

certbot "${CERTBOT_ARGS[@]}"

if [[ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
  echo "LỖI: Không tạo được certificate."
  exit 1
fi

echo "==> Bật Nginx cổng 443..."
cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.ssl.conf" "$SITES_AVAILABLE/$SITE_NAME"
nginx -t && systemctl reload nginx

echo ""
echo "Hoàn tất SSL."
echo "  Cloudflare → SSL/TLS → Full hoặc Full (strict)"
echo "  Kiểm tra: curl -I https://$DOMAIN/"
echo "  Gia hạn tự động: certbot renew (cron có sẵn sau apt install certbot)"
