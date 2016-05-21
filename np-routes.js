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
.get( global.NP_CONFIG.api + '/', function(req, res) {
  console.log('程序及API概览信息');
  res.jsonp(global.NP_CONFIG.info);
})

// 全站配置
.get( global.NP_CONFIG.api + '/config', function(req, res) {
  // console.log('输出全局自定义配置');
  res.jsonp({name: 'Surmon - 自定义配置部分'});
})

// 文章搜索
.get( global.NP_CONFIG.api + '/search/:keyword', function(req, res) {
  res.end('Hello,World!, I \'m Search Page API');
})

// 全部文章列表
.get( global.NP_CONFIG.api + '/article', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m article_lists API');
})

// Tag标签列表
.get( global.NP_CONFIG.api + '/tag', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag_list API');
})

// 分类文章列表
.get( global.NP_CONFIG.api + '/category/:category_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m category' + req.params.category_id);
})

// 标签文章列表
.get( global.NP_CONFIG.api + '/tag/:tag_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag post list'  + req.params.tag_id + ' page:' +  req.query.page);
})

// 日期文章列表
.get( global.NP_CONFIG.api + '/date/:date_ymd', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m date API');
})

// 文章内容页
.get( global.NP_CONFIG.api + '/article/:article_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m article page API');
})

// 单独页面
.get( global.NP_CONFIG.api + '/:page_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m page page API');
})

// 404页面交给前端处理
.get('*', function(req, res){
  res.sendfile('./np-client/np-user/Surmon/index.html');
});

// 监听端口
routeModule.listen(8000, function (argument) {
  console.log('NodePress启动成功！');
});