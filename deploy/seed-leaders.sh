#!/bin/bash
# Nạp 13 lãnh đạo mẫu (đúng ảnh thiết kế)
#   bash deploy/seed-leaders.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$APP_ROOT"

mkdir -p data public/images/portraits

if [[ ! -f "$APP_ROOT/data/leaders.sample.json" ]]; then
  echo "Thiếu data/leaders.sample.json — chạy git pull hoặc build trước."
  exit 1
fi

cp "$APP_ROOT/data/leaders.sample.json" "$APP_ROOT/data/leaders.json"
echo "Đã nạp $(grep -c '"id"' data/leaders.json) lãnh đạo vào data/leaders.json"
echo "Ảnh chân dung: đặt file PNG vào public/images/portraits/<id>.png"
echo "Khởi động lại: docker compose --env-file deploy/env.server up -d"
