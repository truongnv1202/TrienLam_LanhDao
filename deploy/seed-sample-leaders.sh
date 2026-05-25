#!/bin/bash
# Nạp dữ liệu lãnh đạo mẫu theo ảnh — chạy trên server:
#   bash deploy/seed-sample-leaders.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SEED_SRC="$APP_ROOT/data/leaders.seed.json"
DATA_FILE="$APP_ROOT/data/leaders.json"

mkdir -p "$APP_ROOT/data" "$APP_ROOT/public/uploads" "$APP_ROOT/public/fonts"

if [[ -f "$SEED_SRC" ]]; then
  cp "$SEED_SRC" "$DATA_FILE"
else
  echo "Chạy build trước hoặc copy data/leaders.seed.json"
  exit 1
fi

chown 1001:1001 "$DATA_FILE" 2>/dev/null || chmod 664 "$DATA_FILE"
echo "Đã nạp dữ liệu mẫu: $DATA_FILE"
echo "Upload ảnh chân dung mới: public/uploads/home_{id}.jpg hoặc public/uploads/popup_{id}.jpg"
