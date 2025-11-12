#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies (including dev for TypeScript)
npm install --include=dev

# Build TypeScript
npm run build

# Generate Prisma client
npx prisma generate
