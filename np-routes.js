// 路由模块
var express = require('express');
var userRouteModule = express();

// 使用中间件创建静态文件访问
userRouteModule.use(express.static('./'))

// 前端用户访问
.get('/', function(req, res) {
  res.sendfile('./np-themes/Surmon/index.html');
})

// 前端管理员访问
.get('/admin', function(req, res) {
  res.sendfile('./np-admin/index.html');
})

// 服务端API
// 首页
.get( global.config.api_url + '/', function(req, res) {
  res.end('Hello,World!, I \'m Index');
})

// 全站配置
.get( global.config.api_url + '/config', function(req, res) {
  res.end('Hello,World!, I \'m config Page');
})

// 最新文章列表
.get( global.config.api_url + '/hot_article', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m hot_article_lists');
})

// Tag标签列表
.get( global.config.api_url + '/tag_list', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag_list');
})

// 分类文章列表
.get( global.config.api_url + '/category/:category_name', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m category' + req.params.category_name);
})

// 标签文章列表
.get( global.config.api_url + '/tag/:tag_name', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag post list'  + req.params.tag_name + ' page:' +  req.query.page);
})

// 日期文章列表
.get( global.config.api_url + '/date/:date_ymd', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m date');
})

// 文章内容页
.get( global.config.api_url + '/article/:article_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m article page');
})

// 单独页面
.get( global.config.api_url + '/:page_name', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m page page');
})

// 404页面交给前端处理
.get('*', function(req, res){
  res.sendfile('./np-themes/Surmon/index.html');
});

// 监听端口
userRouteModule.listen(process.env.VCAP_APP_PORT || 80, function (argument) {
  console.log('请求执行成功！');
});