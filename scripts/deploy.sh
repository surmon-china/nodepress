#!/bin/bash

PM2_APP_NAME=nodepress

WEB_PATH=$(dirname $0)

cd $WEB_PATH
cd ..

echo "[deploy] start deployment..."

echo "[deploy] fetching..."
echo "[deploy] path:" $(pwd)
echo "[deploy] pulling source code..."
git fetch --all && git reset --hard origin/main && git pull
git checkout main

echo "[deploy] stop pm2 app..."
pm2 stop $PM2_APP_NAME -s

echo "[deploy] pnpm install..."
pnpm install --frozen-lockfile --production

echo "[deploy] reload release code..."
rm -rf dist
mkdir dist
cd dist
curl -OL https://github.com/surmon-china/nodepress/archive/refs/heads/release.zip && unzip release.zip
mv nodepress-release/* ./
rm -rf nodepress-release
rm -rf release.zip
cd ..

echo "[deploy] restart pm2 app..."
pm2 restart $PM2_APP_NAME -s

echo "[deploy] finished."
