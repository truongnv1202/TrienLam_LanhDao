#!/bin/bash
# Khởi động toàn bộ stack trên server — chạy 1 lệnh:
#   sudo bash /opt/TrienLam_LanhDao/deploy/server-up.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao"
DOMAIN="lanhdao.gamegiaoduc.co"
cd "$APP_ROOT"

echo "==> [1/4] Tạo thư mục & phân quyền..."
mkdir -p \
  "$APP_ROOT/data" \
  "$APP_ROOT/public/uploads" \
  "$APP_ROOT/public/certbot" \
  "$APP_ROOT/public/videos" \
  "$APP_ROOT/public/images" \
  "$APP_ROOT/public/fonts"
# Video nền 16:9: public/videos/home-background.mp4

if [[ ! -f "$APP_ROOT/public/fonts/lato/lato-latin-ext-400-normal.woff2" ]]; then
  echo "    LỖI: Thiếu font Lato tại $APP_ROOT/public/fonts/lato/"
  echo "    Hãy cập nhật/copy thư mục public/fonts/lato lên server trước khi deploy."
  exit 1
fi

# UID user nextjs trong container Docker
chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null \
  || chmod -R a+rwX "$APP_ROOT/data" "$APP_ROOT/public/uploads"

echo "==> [2/5] Tạo deploy/env.server (nếu thiếu) & cấu hình admin..."
bash "$APP_ROOT/deploy/ensure-env.sh"

APP_IMAGE=$(grep '^APP_IMAGE=' "$APP_ROOT/deploy/env.server" 2>/dev/null | cut -d= -f2- || echo "$APP_IMAGE")
APP_PORT=$(grep '^APP_PORT=' "$APP_ROOT/deploy/env.server" 2>/dev/null | cut -d= -f2- || echo "$APP_PORT")

PW_LEN=$(grep '^ADMIN_PASSWORD=' "$APP_ROOT/deploy/env.server" 2>/dev/null | cut -d= -f2- | wc -c || echo 0)
SEC_LEN=$(grep '^ADMIN_SESSION_SECRET=' "$APP_ROOT/deploy/env.server" 2>/dev/null | cut -d= -f2- | wc -c || echo 0)
if [[ ! -f "$APP_ROOT/deploy/env.server" ]] || [[ "$PW_LEN" -lt 7 ]] || [[ "$SEC_LEN" -lt 17 ]]; then
  if [[ $EUID -eq 0 ]]; then
    bash "$APP_ROOT/deploy/setup-admin-env.sh"
  else
    sudo bash "$APP_ROOT/deploy/setup-admin-env.sh"
  fi
fi

echo "==> [3/5] Build & start Docker..."
docker compose --env-file "$APP_ROOT/deploy/env.server" up -d --build

echo "==> [4/5] Đợi app sẵn sàng..."
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:$APP_PORT/api/health" >/dev/null 2>&1; then
    echo "    App OK (cổng $APP_PORT)"
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "    LỖI: App không phản hồi. Xem log:"
    docker compose --env-file "$APP_ROOT/deploy/env.server" logs --tail=80
    exit 1
  fi
  sleep 2
done

echo "==> [5/5] Cài / reload Nginx..."
if [[ $EUID -eq 0 ]]; then
  bash "$APP_ROOT/deploy/nginx/install.sh"
else
  sudo bash "$APP_ROOT/deploy/nginx/install.sh"
fi

echo ""
echo "Hoàn tất. Kiểm tra:"
echo "  curl -I http://127.0.0.1:$APP_PORT/api/health"
echo "  curl -I -H 'Host: $DOMAIN' http://127.0.0.1/"
echo "  https://$DOMAIN"
echo "  https://$DOMAIN/admin1111/login"
echo ""
echo "Bật cổng 443 (Cloudflare Full):"
echo "  sudo bash $APP_ROOT/deploy/nginx/enable-ssl.sh"
