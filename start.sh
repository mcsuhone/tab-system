#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting the application..."

echo "📦 Running database migrations..."
pnpm tsx db/migrate.ts
if [ $? -ne 0 ]; then
    echo "❌ Migration failed!"
    exit 1
fi

echo "✨ Starting the main application..."
pnpm start 