
// 程序配置
const CONFIG = require('../np-config');

// API分配
exports.distribute = function(req, res) {
  console.log('请求API');
  console.log(req._parsedUrl.path);
  // 分析路径，执行路由分配
  res.jsonp(req._parsedUrl.path);

  return false;

  // 否则路由不存在
  res.jsonp({
    code: 0,
    message: '路由不存在'
  });
};

/*

// 全站配置
app.get(CONFIG.api + '/config', api.config);

// 文章搜索
app.get(CONFIG.api + '/search/:keyword', api.search);

// 全部文章列表
app.get(CONFIG.api + '/articles', api.articles);

// Tag标签列表
app.get(CONFIG.api + '/tags', api.tags);

// 分类文章列表
app.get(CONFIG.api + '/category/:category_id', api.category);

// 标签文章列表
app.get(CONFIG.api + '/tag/:tag_id', api.tag);

// 日期文章列表
app.get(CONFIG.api + '/date/:date_ymd', api.dates);

// 文章内容页
app.get(CONFIG.api + '/article/:article_id', api.article)

// 单独页面
app.get(CONFIG.api + '/:page_id', api.page)

*/

// GET

exports.api = function(req, res) {
  console.log('程序及API概览信息');
  res.jsonp(CONFIG.info);
};

// 全站配置
exports.config = function(req, res) {
  // console.log('输出全局自定义配置');
  res.jsonp({name: 'Surmon - 自定义配置部分'});
};

// 文章搜索
exports.search = function(req, res) {
  res.end('Hello,World!, I \'m Search Page API');
};

// 全部文章列表
exports.articles = function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m article_lists API');
};

// Tag标签列表
exports.tags = function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag_list API');
};

// 分类文章列表
exports.category = function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m category' + req.params.category_id);
};

// 标签文章列表
exports.tag = function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m tag post list'  + req.params.tag_id + ' page:' +  req.query.page);
};

// 日期文章列表
exports.dates = function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m date API');
};

// 文章内容页
exports.article = function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m article page API');
};

// 单独页面
exports.page = function(req, res) {
  // console.log(req);
  res.end('Hello,World!, I \'m page page API');
};