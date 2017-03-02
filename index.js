'use strict'

// import
const http = require('http');
const gc   = require('idle-gc');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const mongoosePaginate = require('mongoose-paginate');
require('app-module-path').addPath(__dirname + '/');

// app modules
const config = require('np-config');
const routes = require('np-routes');
const mongodb = require('np-mongodb');
const app = express();

// 连接数据库
mongodb.connect();

// 翻页全局配置
mongoosePaginate.paginate.options = {
  limit: config.APP.LIMIT
};

// app config
app.set('port', config.APP.PORT);
app.use(helmet());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// app routes
routes(app);

// Start server
http.createServer(app).listen(app.get('port'), () => {
	gc.start();
  console.log(`NodePress Run！port at ${app.get('port')}`)
});
