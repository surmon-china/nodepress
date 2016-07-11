
'use strict';

// 启动命令：node --harmony index.js

// 主程序模块
const express    = require('express');
const bodyParser = require('body-parser');
const http       = require('http');
const exphbs     = require('express-handlebars');
const app        = module.exports = express();
const view       = require('./np-route/view');
const api        = require('./np-route/api');
const CONFIG     = require('./np-config');

// 服务配置
app.engine('.html', exphbs({extname: '.html', defaultLayout: 'main'}));
app.set('view engine', '.html');
app.set('views', 'np-public/np-spider/');
app.set('port', process.env.PORT || 8000);
app.use(bodyParser());

// 使用中间件创建静态文件访问
app.use(express.static('./np-public/'));

// 前台
app.get('/', view.index);

// 后台
app.get('/admin', view.admin);
app.all('/admin/*', view.admin);

// API
app.get('/api/', (req, res) => {res.jsonp(CONFIG.INFO)});

// 全局设置
app.all('/api/config', api.config.all);

// Article
app.all('/api/article', api.article.all);
app.all('/api/article/:article_id', api.article.item);

/*

// Tag
app.all('/api/tag', api.tag);
app.all('/api/tag/batch', api.tag);
app.all('/api/tag/:tag_id', api.tag);

// Search
app.all('/api/search', api.search);
app.all('/api/search/:tag_id', api.search);

// Category
app.all('/api/category', api.category);
app.all('/api/category/:category_id', api.category);

// Page
app.all('/api/page', api.page);
app.all('/api/page/:page_id', api.page);

*/

// API统配
app.all('/api/*', (req, res) => {res.jsonp({ code: 0, message: 'API不存在' })});

// 404统配
app.get('*', view.index);

// Start server
http.createServer(app).listen(app.get('port'), () => {
  console.log('NodePress启动成功！' + app.get('port'));
});