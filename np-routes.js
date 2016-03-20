// 路由模块
var express = require('express');
var userRouteModule = express();

// 使用中间件创建静态文件访问
userRouteModule.use(express.static(__dirname + '/'))

// 前端用户访问
.get('/', function(req, res) {
  res.sendfile('./np-themes/Surmon/index.html');
})

// 前端管理员访问
.get('/admin', function(req, res) {
  res.sendfile('./np-admin/index.html');
})

// 前端管理员访问
// .get('/admin/:admin', function(req, res) {
//   res.sendfile('./np-admin/index.html');
// })

// 前端管理员访问
// .get('/admin/:admin/:admin_page', function(req, res) {
//   res.sendfile('./np-admin/index.html');
// })

// 服务端API

// 首页信息
.get( global.config.api_path + '/', function(req, res) {
  res.end('Hello,World!, I \'m Index API');
})

// 全站配置
.get( global.config.api_path + '/config', function(req, res) {
  res.end('Hello,World!, I \'m config Page API');
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
  console.log('遇到了未知界面');
  res.sendfile('./np-themes/Surmon/index.html');
});

// 监听端口
userRouteModule.listen(process.env.VCAP_APP_PORT || 8000, function (argument) {
  console.log('NodePress启动成功！');
});