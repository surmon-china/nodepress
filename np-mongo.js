// 数据库模块
var mongoose = require('mongoose');
var config   = require('./np-config');
var mongodb  = mongoose.connection;

// 数据库
var db = function () {

  // 连接数据库
  mongoose.connect(config.MONGODB.uri);

  // 连接错误
  mongodb.on('error', function(error) {
    console.log(error);
  });

  // 连接成功
  mongodb.once('open', function() {
    console.log('mongoose 连接成功!');
  });

  return mongodb;
};

module.exports = db;