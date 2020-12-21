#!/bin/bash

WEB_PATH=$(dirname $0)

# MARK: 需保证脚本的独立性，不可避免地需要一些部分与业务代码耦合，此处将 <BACK_PATH> 与 <BACK_FILE> 约定为耦合部分
# BACK_PATH 默认值为 '../dbbackup'
BACK_PATH='dbbackup'
# BACK_FILE 默认值为 'nodepress.tar.gz'
BACK_FILE='nodepress.tar.gz'

cd $WEB_PATH
cd ..
cd ./$BACK_PATH

pwd

sudo rm -rf ./NodePress.bak
sudo mv ./NodePress ./NodePress.bak
mongodump -h 127.0.0.1:27017 -d NodePress -o .
tar -czf ./$BACK_FILE ./NodePress

echo 'DB backup done!'
