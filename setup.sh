#!/bin/bash
set -e
echo "Starting setup script..."

# 1. Create .env if missing
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
fi

# 2. Install dependencies (using npm to match CI workflow and lockfile)
echo "Installing dependencies..."
npm ci

# 3. Inform user about missing database requirement
echo "Note: Some tests require a PostgreSQL database."
echo "If tests fail with 'relation does not exist', ensure the database is running and migrated."
echo "Setup complete."
