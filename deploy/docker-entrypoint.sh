#!/bin/sh
set -e

mkdir -p /app/data /app/public/uploads /app/public/fonts

if [ ! -f /app/public/fonts/lato/lato-latin-ext-400-normal.woff2 ]; then
  echo "Missing Lato font files in /app/public/fonts/lato" >&2
  exit 1
fi

# Volume mount từ host thường là root — cấp quyền cho user nextjs (uid 1001)
chown -R nextjs:nodejs /app/data /app/public/uploads 2>/dev/null || chmod -R a+rwX /app/data /app/public/uploads

exec su-exec nextjs "$@"
