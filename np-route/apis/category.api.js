/*
*
* 分类分类API
*
*/

// 引用分类控制器处理
var categoryCtrl = require('../../np-controller/category.controller');
var categoryApi;
categoryApi = {};
categoryApi.list = {};
categoryApi.item = {};

// 类型识别
categoryApi.method = (req, res, type) => {
  let method = req.method;
  let support = !!categoryApi[type] && !!categoryApi[type][method];
  if (support) categoryApi[type][method](req, res);
  if (!support) res.jsonp({ code: 0, message: '请求不支持！' });
};

// 获取分类列表
categoryApi.list.GET = (req, res) => {
  categoryCtrl.getList({
    query: req.query,
    success: data => {
      res.jsonp({ 
        code: 1, 
        message: '分类列表获取成功',
        result: data
      });
    },
    error: err => { 
      res.jsonp({ code: 0, message: err.message || '分类列表获取失败' }) 
    }
  });
};

// 发布分类
categoryApi.list.POST = (req, res) => {
  categoryCtrl.postItem({
    body: req.body,
    success: data => {
      res.jsonp({ 
        code: 1, 
        message: data.message || '分类发布成功',
        result: data
      });
    },
    error: err => {
      res.jsonp({ code: 0, message: err.message || '分类发布失败', debug: err.debug || null }) 
    }
  });
};

// 批量删除分类
categoryApi.list.DELETE = (req, res) => {
  categoryCtrl.delList({
    body: req.body,
    success: data => {
      res.jsonp({ 
        code: 1, 
        message: data.message || '分类批量删除成功',
        result: data
      });
    },
    error: err => {
      res.jsonp({ code: 0, message: err.message || '分类批量删除失败', debug: err.debug || null }) 
    }
  });
};

// 获取单个分类
categoryApi.item.GET = (req, res) => {
  res.jsonp({ code: 1, message: '单篇分类获取成功' });
};

// 修改单个分类
categoryApi.item.PUT = (req, res) => {
  res.jsonp({ code: 1, message: '单篇分类修改成功' });
};

// 删除单个分类
categoryApi.item.DELETE = (req, res) => {
  res.jsonp({ code: 1, message: '单篇分类删除成功' });
};

// 模块暴露
exports.list = (req, res) => { categoryApi.method(req, res, 'list') };
exports.item = (req, res) => { categoryApi.method(req, res, 'item') };