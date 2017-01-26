'use strict'

// import
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoosePaginate = require('mongoose-paginate');

// app modules
const config = require('./np-config');
const mongodb = require('./np-mongo');
const routes = require('./np-routes');
const app = express();

// 连接数据库
mongodb();

// 翻页全局配置
mongoosePaginate.paginate.options = {
  limit: config.APP.LIMIT
};

// app config
app.set('port', config.APP.PORT);
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// app routes
routes(app);

// Start server
http.createServer(app).listen(app.get('port'), () => {
  console.log(`NodePress Run！port at ${app.get('port')}`)
});
