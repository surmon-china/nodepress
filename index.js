
'use strict';

// 启动命令：node --harmony index.js

// 主程序模块
const http       = require('http');
const express    = require('express');
const bodyParser = require('body-parser');
const exphbs     = require('express-handlebars');
const mongoosePaginate = require('mongoose-paginate');
const view       = require('./np-route/view');
const api        = require('./np-route/api');
const CONFIG     = require('./np-config');
const mongodb    = require('./np-mongo');
const app        = express();

// 连接数据库
mongodb();

// 翻页全局配置
mongoosePaginate.paginate.options = {
  limit: 10
};

// 服务配置
app.engine('.html', exphbs({extname: '.html', defaultLayout: 'main'}));
app.set('view engine', '.html');
app.set('views', 'np-public/np-spider/');
app.set('port', 8000);
app.use(bodyParser());

// 使用中间件创建静态文件访问
app.use(express.static('./np-public/'));

// 前台
app.get('/', view.index);

// 后台
app.get('/admin', view.admin);
app.all('/admin/*', view.admin);

// Api
app.get('/api/', (req, res) => {res.jsonp(CONFIG.INFO)});

// 全局设置
app.all('/api/option', api.option);

// Article
app.all('/api/article', api.article.list);
app.all('/api/article/:article_slug', api.article.item);

// Category
app.all('/api/category', api.category.list);
app.all('/api/category/:category_id', api.category.item);

// Tag
app.all('/api/tag', api.tag.list);
app.all('/api/tag/:tag_id', api.tag.item);

// Page
app.all('/api/page', api.page.list);
app.all('/api/page/:page_id', api.page.item);

/*

// Search
app.all('/api/search', api.search);
app.all('/api/search/:tag_id', api.search);

*/

// API统配
app.all('/api/*', (req, res) => {res.jsonp({ code: 0, message: 'API不存在' })});

// 404统配
app.get('*', view.index);

// Start server
http.createServer(app).listen(app.get('port'), () => {
  console.log('NodePress启动成功！' + app.get('port'));
});