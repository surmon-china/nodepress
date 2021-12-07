#!/bin/bash

WEB_PATH=$(dirname $0)
# WEB_USER='root'
# WEB_USERGROUP='root'

echo "[deploy] Start deployment..."
echo "[deploy] Fetch and rebuilding..."
cd $WEB_PATH
cd ..

echo "[deploy] path:" $(pwd)
echo "[deploy] pulling source code..."

git fetch --all && git reset --hard origin/main && git pull
git checkout main
# echo "changing permissions..."
# chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
# chmod -R 777 $WEB_PATH
# sync && echo 3 | sudo tee /proc/sys/vm/drop_caches

echo "[deploy] Install dependencies..."
yarn install --frozen-lockfile

echo "[deploy] Stop service..."
pm2 stop nodepress

echo "[deploy] Remove old dist..."
yarn prebuild

echo "[deploy] Building..."
# Fix for JavaScript heap out of memory
export NODE_OPTIONS=--max_old_space_size=4096
yarn build

echo "[deploy] Restarting..."
pm2 restart nodepress

echo "[deploy] Finished."
