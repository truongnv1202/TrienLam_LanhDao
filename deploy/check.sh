#!/bin/bash
# Chẩn đoán nhanh — bash /opt/TrienLam_LanhDao/deploy/check.sh
APP_ROOT="/opt/TrienLam_LanhDao"

echo "=== Docker ==="
docker ps -a --filter name=trienlam-lanhdao 2>/dev/null || echo "Docker không chạy?"

echo ""
echo "=== Cổng 5006 ==="
curl -sf -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:5006/api/health 2>/dev/null || echo "Không kết nối được 127.0.0.1:5006"

echo ""
echo "=== Nginx config ==="
sudo nginx -t 2>&1 || true

echo ""
echo "=== Nginx proxy (Host header) ==="
curl -sf -o /dev/null -w "HTTP %{http_code}\n" -H "Host: lanhdao.gamegiaoduc.co" http://127.0.0.1/ 2>/dev/null || echo "Nginx proxy lỗi"

echo ""
echo "=== Log Docker (20 dòng cuối) ==="
docker logs trienlam-lanhdao --tail=20 2>/dev/null || true

echo ""
echo "=== Log Nginx error ==="
sudo tail -5 /var/log/nginx/lanhdao.error.log 2>/dev/null || true
