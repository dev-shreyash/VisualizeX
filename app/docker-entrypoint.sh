#!/bin/sh
set -e

if [ -f "./node_modules/.bin/prisma" ] && [ -n "$DATABASE_URL" ]; then
  echo "==> Applying Prisma database migrations..."
  ./node_modules/.bin/prisma migrate deploy || echo "Prisma migration finished with code $?"
fi

exec "$@"

