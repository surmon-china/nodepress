#!/bin/bash

WEB_PATH=$(dirname $0)
BACK_PATH='dbbackup'

cd $WEB_PATH
cd ..
cd ./$BACK_PATH

pwd

mongorestore -h 127.0.0.1:27017 -d NodePress ./NodePress/

echo 'DB restore done!'
