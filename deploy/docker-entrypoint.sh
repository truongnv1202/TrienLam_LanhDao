#!/bin/sh
set -e

mkdir -p /app/data /app/public/uploads/portraits

# Volume mount từ host thường là root — cấp quyền cho user nextjs (uid 1001)
chown -R nextjs:nodejs /app/data /app/public/uploads 2>/dev/null || chmod -R a+rwX /app/data /app/public/uploads

exec su-exec nextjs "$@"
