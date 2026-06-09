#!/bin/bash
# Chẩn đoán nhanh — bash /opt/TrienLam_LanhDao/deploy/check.sh
APP_ROOT="/opt/TrienLam_LanhDao"
DOMAIN="lanhdao.gamegiaoduc.co"
APP_PORT="5006"
CONTAINER_NAME="trienlam-lanhdao"

echo "=== Docker ==="
docker ps -a --filter name="$CONTAINER_NAME" 2>/dev/null || echo "Docker không chạy?"

echo ""
echo "=== Cổng $APP_PORT ==="
curl -sf -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:$APP_PORT/api/health" 2>/dev/null || echo "Không kết nối được 127.0.0.1:$APP_PORT"

echo ""
echo "=== Nginx config ==="
sudo nginx -t 2>&1 || true

echo ""
echo "=== Nginx proxy (Host header) ==="
curl -sf -o /dev/null -w "HTTP %{http_code}\n" -H "Host: $DOMAIN" http://127.0.0.1/ 2>/dev/null || echo "Nginx proxy lỗi"

echo ""
echo "=== Log Docker (20 dòng cuối) ==="
docker logs "$CONTAINER_NAME" --tail=20 2>/dev/null || true

echo ""
echo "=== Log Nginx error ==="
sudo tail -5 /var/log/nginx/lanhdao.error.log 2>/dev/null || true
