// 路由模块
var express = require('express');
var userRouteModule = express();
// var adminRouteModule = express();
// var adminArticleRoute = express.Router();

// 使用中间件创建静态文件访问
userRouteModule.use(express.static('./np-rescources'))
// app.use(express.static(path.join(__dirname, 'public')));

// 前台路由/PATH/单独路由
// 首页
.get('/', function(req, res) {
  res.end('Hello,World!, I \'m Index');
})

// 全站配置
.get('/config', function(req, res) {
  res.end('Hello,World!, I \'m config Page');
})

// 最新文章列表
.get('/hot_article', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m hot_article_lists');
})

// Tag标签列表
.get('/tag_list', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag_list');
})

// 分类文章列表
.get('/category/:category_name', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m category' + req.params.category_name);
})

// 标签文章列表
.get('/tag/:tag_name', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag post list'  + req.params.tag_name + ' page:' +  req.query.page);
})

// 日期文章列表
.get('/date/:date_ymd', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m date');
})

// 文章内容页
.get('/article/:article_id', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m article page');
})

// 单独页面
.get('/:page_name', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m page page');
})

// 404错误页面
.get('*', function(req, res){
  res.end('Hello,World!, I \'m 404 page');
    // res.render('404.html', {
      // title: 'No Found'
    // })
});

// 监听端口
userRouteModule.listen(80, function (argument) {
  console.log('请求执行成功！');
});