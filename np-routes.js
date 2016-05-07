// 路由模块
var express = require('express');
var routeModule = express();

// 使用中间件创建静态文件访问
routeModule.use(express.static(__dirname + '/np-client/'))

// 前台
.get('/', function(req, res) {
  res.sendfile('./np-client/np-user/Surmon/index.html');
})

// 后台
.get('/admin', function(req, res) {
  console.log('访问admin首页');
  res.sendfile('./np-client/np-admin/index.html');
})

// 后台
.all('/admin/*', function (req, res) {
  res.sendfile('./np-client/np-admin/index.html');
})

// 服务端API
.get( global.config.api_path + '/', function(req, res) {
  res.jsonp(global.config);
})

// 全站配置
.get( global.config.api_path + '/config', function(req, res) {
  console.log('输出全栈配置');
  res.jsonp({name: 'Surmon - Blog'});
})

// 文章搜索
.get( global.config.api_path + '/search/:keyword', function(req, res) {
  res.end('Hello,World!, I \'m Search Page API');
})

// 全部文章列表
.get( global.config.api_path + '/article', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m article_lists API');
})

// Tag标签列表
.get( global.config.api_path + '/tag', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag_list API');
})

// 分类文章列表
.get( global.config.api_path + '/category/:category_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m category' + req.params.category_id);
})

// 标签文章列表
.get( global.config.api_path + '/tag/:tag_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag post list'  + req.params.tag_id + ' page:' +  req.query.page);
})

// 日期文章列表
.get( global.config.api_path + '/date/:date_ymd', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m date API');
})

// 文章内容页
.get( global.config.api_path + '/article/:article_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m article page API');
})

// 单独页面
.get( global.config.api_path + '/:page_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m page page API');
})

// 404页面交给前端处理
.get('*', function(req, res){
  res.sendfile('./np-client/np-user/Surmon/index.html');
});

// 监听端口
routeModule.listen(process.env.VCAP_APP_PORT || 80, function (argument) {
  console.log('NodePress启动成功！');
});