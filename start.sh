#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting the application..."

# Function to check if postgres is ready
wait_for_postgres() {
  echo "Waiting for postgres..."
  while ! pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
  do
    echo "Postgres is unavailable - sleeping"
    sleep 1
  done
  echo "Postgres is up - executing command"
}

# Wait for postgres to be ready
wait_for_postgres

# Try to run migrations with retries
MAX_RETRIES=5
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "📦 Running database migrations... (Attempt $(($RETRY_COUNT + 1))/$MAX_RETRIES)"
  if pnpm tsx db/migrate.ts; then
    echo "✅ Migrations completed successfully!"
    break
  else
    RETRY_COUNT=$(($RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
      echo "❌ Migration failed after $MAX_RETRIES attempts!"
      exit 1
    fi
    echo "⚠️ Migration failed, retrying in 5 seconds..."
    sleep 5
  fi
done

echo "✨ Starting the main application..."
pnpm start