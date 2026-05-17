#!/bin/bash
# Cài SSL + bật Nginx cổng 443 (cả lanhdao + admin subdomain)
# Chạy: sudo bash /opt/TrienLam_LanhDao/deploy/nginx/enable-ssl.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao"
DOMAIN_MAIN="lanhdao.gamegiaoduc.co"
DOMAIN_ADMIN="admin.lanhdao.gamegiaoduc.co"
EMAIL="${CERTBOT_EMAIL:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SNIPPETS_DIR="/etc/nginx/snippets"
CONF_D_DIR="/etc/nginx/conf.d"
SITES_AVAILABLE="/etc/nginx/sites-available"
SITES_ENABLED="/etc/nginx/sites-enabled"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN_MAIN/fullchain.pem"

if [[ $EUID -ne 0 ]]; then
  echo "Chạy với sudo."
  exit 1
fi

if [[ ! -d "$APP_ROOT" ]]; then
  echo "Thiếu $APP_ROOT"
  exit 1
fi

echo "==> Kiểm tra Docker (cổng 5006)..."
if ! curl -sf "http://127.0.0.1:5006/api/health" >/dev/null; then
  echo "App chưa chạy: cd $APP_ROOT && docker compose --env-file deploy/env.server up -d"
  exit 1
fi

if ! command -v certbot >/dev/null; then
  apt-get update -qq
  apt-get install -y certbot
fi

mkdir -p "$APP_ROOT/public/certbot" "$SNIPPETS_DIR" "$CONF_D_DIR"
chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null || true

echo "==> Snippets & upstream..."
cp "$SCRIPT_DIR/conf.d/lanhdao-upstream.conf" "$CONF_D_DIR/lanhdao-upstream.conf"
cp "$SCRIPT_DIR/snippets/lanhdao-proxy.conf" "$SNIPPETS_DIR/lanhdao-proxy.conf"
cp "$SCRIPT_DIR/snippets/lanhdao-locations.conf" "$SNIPPETS_DIR/lanhdao-locations.conf"

deploy_bootstrap() {
  cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.bootstrap.conf" \
    "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf"
  cp "$SCRIPT_DIR/admin.lanhdao.gamegiaoduc.co.bootstrap.conf" \
    "$SITES_AVAILABLE/admin.lanhdao.gamegiaoduc.co.conf"
  ln -sf "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf" \
    "$SITES_ENABLED/lanhdao.gamegiaoduc.co.conf"
  ln -sf "$SITES_AVAILABLE/admin.lanhdao.gamegiaoduc.co.conf" \
    "$SITES_ENABLED/admin.lanhdao.gamegiaoduc.co.conf"
  nginx -t && systemctl reload nginx
}

deploy_production() {
  cp "$SCRIPT_DIR/lanhdao.gamegiaoduc.co.conf" \
    "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf"
  cp "$SCRIPT_DIR/admin.lanhdao.gamegiaoduc.co.conf" \
    "$SITES_AVAILABLE/admin.lanhdao.gamegiaoduc.co.conf"
  ln -sf "$SITES_AVAILABLE/lanhdao.gamegiaoduc.co.conf" \
    "$SITES_ENABLED/lanhdao.gamegiaoduc.co.conf"
  ln -sf "$SITES_AVAILABLE/admin.lanhdao.gamegiaoduc.co.conf" \
    "$SITES_ENABLED/admin.lanhdao.gamegiaoduc.co.conf"
  nginx -t && systemctl reload nginx
}

if [[ -f "$CERT_PATH" ]]; then
  echo "==> Đã có certificate — triển khai config có cổng 443..."
  deploy_production
else
  echo "==> Bootstrap HTTP (ACME challenge)..."
  deploy_bootstrap

  echo "==> Lấy chứng chỉ Let's Encrypt (2 domain)..."
  CERTBOT_ARGS=(
    certonly --webroot
    -w "$APP_ROOT/public/certbot"
    -d "$DOMAIN_MAIN"
    -d "$DOMAIN_ADMIN"
    --agree-tos --non-interactive --keep-until-expiring
  )
  if [[ -n "$EMAIL" ]]; then
    CERTBOT_ARGS+=(--email "$EMAIL")
  else
    CERTBOT_ARGS+=(--register-unsafely-without-email)
  fi
  certbot "${CERTBOT_ARGS[@]}"

  if [[ ! -f "$CERT_PATH" ]]; then
    echo "LỖI: Không tạo được certificate."
    exit 1
  fi

  echo "==> Bật Nginx cổng 443..."
  deploy_production
fi

echo ""
echo "Hoàn tất."
echo "  Cloudflare SSL/TLS: Full hoặc Full (strict)"
echo "  https://$DOMAIN_MAIN/"
echo "  https://$DOMAIN_ADMIN/admin/login"
echo "  sudo ufw allow 443/tcp  # nếu dùng firewall"
