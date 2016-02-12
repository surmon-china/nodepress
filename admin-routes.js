// 后台路由模块
var express = require('express');
var adminRouteModule = express();
var adminArticleRoute = express.Router();

// 管理员首页
adminRouteModule.get('/admin', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m admin page index');
});

// 程序升级更新
adminRouteModule.get('/admin/update', function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m app update page');
});

// 文章管理
adminRouteModule.route('/admin/article')
  
  // 获取文章列表（Query：分类/时间/标签/排序/页数/状态）
  .get(function (req, res) {
    res.end('Hello,World!, I \'m admin article index');
  })

  // 发布新文章（post：内容/标题/分类/标签/状态）
  .post(function (req, res) {
    res.end('Hello,World!, I \'m admin article post page');
  })

  // 修改文章（put：内容/标题/分类/标签/状态）
  .put(function (req, res) {
    res.end('Hello,World!, I \'m admin article put page');
  })

  // 删除文章（delete：文章id）
  .delete(function (req, res) {
    res.end('Hello,World!, I \'m admin article delete page');
  })

// adminRouteModule.use('/admin/article', adminArticleRoute);

// 监听端口
// adminRouteModule.listen(80, function (argument) {
//   console.log('请求执行成功！');
// });