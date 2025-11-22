#!/bin/sh
set -e

echo "Building application..."

# Install dependencies
npm ci

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Ensure /data directory exists (for Render persistent disk)
mkdir -p /data

# Run migrations if database doesn't exist
if [ ! -f /data/dev.db ]; then
  echo "Database not found. Running migrations..."
  DATABASE_URL="file:/data/dev.db" npx prisma migrate deploy || npx prisma db push
else
  echo "Database exists. Skipping migrations."
fi

echo "Build complete!"

