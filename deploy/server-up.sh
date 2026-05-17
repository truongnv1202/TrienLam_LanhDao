#!/bin/bash
# Khởi động toàn bộ stack trên server — chạy 1 lệnh:
#   sudo bash /opt/TrienLam_LanhDao/deploy/server-up.sh
set -euo pipefail

APP_ROOT="/opt/TrienLam_LanhDao"
cd "$APP_ROOT"

echo "==> [1/4] Tạo thư mục & phân quyền..."
mkdir -p \
  "$APP_ROOT/data" \
  "$APP_ROOT/public/uploads/portraits" \
  "$APP_ROOT/public/certbot" \
  "$APP_ROOT/public/videos" \
  "$APP_ROOT/public/images"

# UID user nextjs trong container Docker
chown -R 1001:1001 "$APP_ROOT/data" "$APP_ROOT/public/uploads" 2>/dev/null \
  || chmod -R a+rwX "$APP_ROOT/data" "$APP_ROOT/public/uploads"

echo "==> [2/4] Build & start Docker..."
docker compose --env-file "$APP_ROOT/deploy/env.server" up -d --build

echo "==> [3/4] Đợi app sẵn sàng..."
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:5006/api/health" >/dev/null 2>&1; then
    echo "    App OK (cổng 5006)"
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "    LỖI: App không phản hồi. Xem log:"
    docker compose --env-file "$APP_ROOT/deploy/env.server" logs --tail=80
    exit 1
  fi
  sleep 2
done

echo "==> [4/4] Cài / reload Nginx..."
if [[ $EUID -eq 0 ]]; then
  bash "$APP_ROOT/deploy/nginx/install.sh"
else
  sudo bash "$APP_ROOT/deploy/nginx/install.sh"
fi

echo ""
echo "Hoàn tất. Kiểm tra:"
echo "  curl -I http://127.0.0.1:5006/api/health"
echo "  curl -I -H 'Host: lanhdao.gamegiaoduc.co' http://127.0.0.1/"
echo "  https://lanhdao.gamegiaoduc.co"
