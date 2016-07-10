/*
 * 主程序模块
*/

// 启动命令：node --harmony index.js

const express    = require('express');
const bodyParser = require('body-parser');
const http       = require('http');
const path       = require('path');
const views      = require('./np-route/views');
const api        = require('./np-route/api');
const app        = module.exports = express();
const CONFIG     = require('./np-config').config;

// 服务配置
app.set('port', process.env.PORT || 8000);
app.use(bodyParser());

// 使用中间件创建静态文件访问
app.use(express.static('./np-public/'));

// 前台
app.get('/', views.index);

// 后台
app.get('/admin', views.admin);
app.all('/admin/*', views.admin);

// API
app.get('/api/', (req, res) => { res.jsonp(CONFIG.info) });
app.all('/api/*', api.distribute);

// 404Page
app.get('*', views.index);

// Start server
http.createServer(app).listen(app.get('port'), () => {
  console.log('NodePress启动成功！' + app.get('port'));
});