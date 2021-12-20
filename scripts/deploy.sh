#!/bin/bash

WEB_PATH=$(dirname $0)

cd $WEB_PATH
cd ..

echo "[deploy] start deployment..."

echo "[deploy] fetching..."
echo "[deploy] path:" $(pwd)
echo "[deploy] pulling source code..."
git fetch --all && git reset --hard origin/main && git pull
git checkout main

echo "[deploy] stop service..."
pm2 stop nodepress

echo "[deploy] yarn install..."
yarn install --frozen-lockfile --production

echo "[deploy] fetching release code..."
rm -rf dist
mkdir dist
cd dist
git clone -b release git@github.com:surmon-china/nodepress.git .
rm -rf .git
cd ..

echo "[deploy] restarting..."
pm2 restart nodepress

echo "[deploy] finished."
