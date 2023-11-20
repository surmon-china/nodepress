#!/bin/bash
set -e

# scripts directory
SHELL_PATH=$(dirname "$0")

echo "[upgrade] starting..."

cd $SHELL_PATH
cd ..

echo "[upgrade] pulling latest source code..."

# latest source code
git fetch origin main
git reset --hard origin/main
git pull origin main --depth 1

echo "[upgrade] pnpm installing..."

# install dependencies
pnpm install --frozen-lockfile --production

echo "[upgrade] downloading release code..."

# latest release code
curl -sOL https://github.com/surmon-china/nodepress/archive/refs/heads/release.zip
unzip -q release.zip
rm -rf dist
mv nodepress-release dist
rm -rf release.zip

echo "[upgrade] finished."
