#!/bin/sh
set -e

# Ensure /data directory exists
mkdir -p /data

# Set DATABASE_URL if not already set
export DATABASE_URL=${DATABASE_URL:-"file:/data/dev.db"}

# Run migrations if needed (for first deploy)
if [ ! -f /data/dev.db ]; then
  echo "Initializing database..."
  npx prisma migrate deploy || npx prisma db push
fi

# Start the application
exec node src/server.js

