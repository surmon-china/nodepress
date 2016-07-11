/*
*
* 文章API模块
*
*/

// 依赖文章控制器
const CONFIG     = require('../../np-config');
var articleCtrl = require(CONFIG.APP.ROOT_PATH + '/np-controller/article.controller');

var articleApi = {};
articleApi.all = {};
articleApi.item = {};

// 类型识别
articleApi.method = (req, res, type) => {
  let method = req.method;
  let support = !!articleApi[type] && !!articleApi[type][method];
  if (support) articleApi[type][method](req, res);
  if (!support) res.jsonp({ code: 0, message: '请求不支持！' });
};

// 获取文章列表
articleApi.all.GET = function(req, res){
  articleCtrl.getList({
    query: req.query,
    success: data => {
      res.jsonp({ 
        code: 1, 
        message: '文章列表获取成功',
        result: data
      });
    },
    error: err => { 
      res.jsonp({ code: 0, message: '文章列表获取失败' }) 
    }
  });
};

// 发布文章
articleApi.all.POST = function(req, res){
  res.jsonp({ code: 1, message: '文章发布成功' });
};

// 批量更新文章
articleApi.all.PUT = function(req, res){
  res.jsonp({ code: 1, message: '文章批量更新成功' });
};

// 批量删除文章
articleApi.all.DELETE = function(req, res){
  res.jsonp({ code: 1, message: '文章批量删除成功' });
};

// 获取单篇文章
articleApi.item.GET = function(req, res){
  res.jsonp({ code: 1, message: '单篇文章获取成功' });
};

// 修改单篇文章
articleApi.item.PUT = function(req, res){
  res.jsonp({ code: 1, message: '单篇文章修改成功' });
};

// 删除单篇文章
articleApi.item.DELETE = function(req, res){
  res.jsonp({ code: 1, message: '单篇文章删除成功' });
};

// 模块暴露
exports.all = (req, res) => { articleApi.method(req, res, 'all') };
exports.item = (req, res) => { articleApi.method(req, res, 'item') };