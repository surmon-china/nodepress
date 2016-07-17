/*
*
* 页面API
*
*/

// 引用页面控制器处理
var pageCtrl = require('../../np-controller/page.controller');
var pageApi;
pageApi = {};
pageApi.list = {};
pageApi.item = {};

// 类型识别
pageApi.method = (req, res, type) => {
  let method = req.method;
  let support = !!pageApi[type] && !!pageApi[type][method];
  if (support) pageApi[type][method](req, res);
  if (!support) res.jsonp({ code: 0, message: '请求不支持！' });
};

// 获取页面列表
pageApi.list.GET = function(req, res){
  pageCtrl.getList({
    query: req.query,
    success: data => {
      res.jsonp({ 
        code: 1, 
        message: '页面列表获取成功',
        result: data
      });
    },
    error: err => { 
      res.jsonp({ code: 0, message: err.message || '页面列表获取失败' }) 
    }
  });
};

// 发布页面
pageApi.list.POST = function(req, res){
  pageCtrl.postItem({
    body: req.body,
    success: data => {
      res.jsonp({ 
        code: 1, 
        message: data.message || '页面发布成功',
        result: data
      });
    },
    error: err => { 
      res.jsonp({ code: 0, message: err.message || '页面发布失败', debug: err.debug || null }) 
    }
  });
};

// 批量更新页面
pageApi.list.PUT = function(req, res){
  res.jsonp({ code: 1, message: '页面批量更新成功' });
};

// 批量删除页面
pageApi.list.DELETE = function(req, res){
  res.jsonp({ code: 1, message: '页面批量删除成功' });
};

// 获取单篇页面
pageApi.item.GET = function(req, res){
  res.jsonp({ code: 1, message: '单篇页面获取成功' });
};

// 修改单篇页面
pageApi.item.PUT = function(req, res){
  res.jsonp({ code: 1, message: '单篇页面修改成功' });
};

// 删除单篇页面
pageApi.item.DELETE = function(req, res){
  res.jsonp({ code: 1, message: '单篇页面删除成功' });
};

// 模块暴露
exports.list = (req, res) => { pageApi.method(req, res, 'list') };
exports.item = (req, res) => { pageApi.method(req, res, 'item') };