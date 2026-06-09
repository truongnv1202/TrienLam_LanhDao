#!/bin/bash
# Cài SSL + Nginx cổng 443 — chỉ lanhdao2.gamegiaoduc.co
# CMS: https://lanhdao2.gamegiaoduc.co/admin1111/login
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao_v2"
DOMAIN="lanhdao2.gamegiaoduc.co"
OLD_DOMAIN="lanhdao.gamegiaoduc.co"
EMAIL="${CERTBOT_EMAIL:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SNIPPETS_DIR="/etc/nginx/snippets"
CONF_D_DIR="/etc/nginx/conf.d"
SITES_AVAILABLE="/etc/nginx/sites-available"
SITES_ENABLED="/etc/nginx/sites-enabled"
SITE_CONF="$DOMAIN.conf"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

if [[ $EUID -ne 0 ]]; then
  echo "Chạy với sudo."
  exit 1
fi

if [[ ! -d "$APP_ROOT" ]]; then
  echo "Thiếu $APP_ROOT"
  exit 1
fi

echo "==> Kiểm tra Docker (cổng 5007)..."
if ! curl -sf "http://127.0.0.1:5007/api/health" >/dev/null; then
  echo "App chưa chạy: cd $APP_ROOT && docker compose --env-file deploy/env.server up -d"
  exit 1
fi

if ! command -v certbot >/dev/null; then
  apt-get update -qq
  apt-get install -y certbot
fi

mkdir -p "$APP_ROOT/public/certbot" "$APP_ROOT/public/fonts" "$SNIPPETS_DIR" "$CONF_D_DIR"
chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null || true

cp "$SCRIPT_DIR/conf.d/lanhdao2-upstream.conf" "$CONF_D_DIR/lanhdao2-upstream.conf"
cp "$SCRIPT_DIR/snippets/lanhdao2-proxy.conf" "$SNIPPETS_DIR/lanhdao2-proxy.conf"
cp "$SCRIPT_DIR/snippets/lanhdao2-locations.conf" "$SNIPPETS_DIR/lanhdao2-locations.conf"

deploy_site() {
  local src="$1"
  cp "$SCRIPT_DIR/$src" "$SITES_AVAILABLE/$SITE_CONF"
  ln -sf "$SITES_AVAILABLE/$SITE_CONF" "$SITES_ENABLED/$SITE_CONF"
  rm -f "$SITES_ENABLED/$OLD_DOMAIN.conf" "$SITES_ENABLED/admin.$OLD_DOMAIN.conf" 2>/dev/null || true
  nginx -t && systemctl reload nginx
}

if [[ -f "$CERT_PATH" ]]; then
  echo "==> Đã có certificate — bật cổng 443..."
  deploy_site "$DOMAIN.conf"
else
  echo "==> Bootstrap HTTP..."
  deploy_site "$DOMAIN.bootstrap.conf"

  echo "==> Certbot..."
  CERTBOT_ARGS=(certonly --webroot -w "$APP_ROOT/public/certbot" -d "$DOMAIN" --agree-tos --non-interactive --keep-until-expiring)
  [[ -n "$EMAIL" ]] && CERTBOT_ARGS+=(--email "$EMAIL") || CERTBOT_ARGS+=(--register-unsafely-without-email)
  certbot "${CERTBOT_ARGS[@]}"

  [[ -f "$CERT_PATH" ]] || { echo "LỖI: Không tạo được certificate."; exit 1; }
  deploy_site "$DOMAIN.conf"
fi

echo ""
echo "Hoàn tất."
echo "  Trang chủ:  https://$DOMAIN/"
echo "  Quản trị:  https://$DOMAIN/admin1111/login"
