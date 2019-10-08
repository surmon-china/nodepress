#!/bin/bash

echo "[deploy] Restarting..."
pm2 restart nodepress
echo "[deploy] Restart done."
