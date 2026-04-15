#!/usr/bin/env sh
set -e

# Run from project root
cd "$(dirname "$0")"

# Use local environment by default.
export NODE_ENV=${NODE_ENV:-local}

if [ ! -f .env.${NODE_ENV} ]; then
  echo "Warning: .env.${NODE_ENV} not found. Falling back to .env.local if present."
  if [ -f .env.local ]; then
    export NODE_ENV=local
  else
    echo "No .env file found for NODE_ENV=${NODE_ENV}. Please create .env.local or .env.${NODE_ENV}." >&2
    exit 1
  fi
fi

echo "Starting superlearning-live-service with NODE_ENV=${NODE_ENV}..."

echo "Installing dependencies if needed..."
npm ci

echo "Running NestJS in development mode..."
npm run start:dev
