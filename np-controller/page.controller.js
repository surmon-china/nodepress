/*
*
* 页面控制器模块
*
*/

var mongoose      = require('mongoose');
var Page       = require('../np-model/page.model');

// 获取页面列表
exports.getList = params => {

  let success = params.success;
  let error   = params.error;

  Page.find({}).populate('category').exec((err, pages) => {
    err && error({ message: '数据库错误' });
    if (!err) {
      let data = {
        pagination: {
          total: 10,
          current_page: 1,
          total_page: 1,
          per_page: 10,
          query: params.query
        },
        data: pages
      };
      success(data);
    }
  })
};

// 发布页面
exports.postItem = function(params) {

  let page = params.body;
  let error = params.error;
  let success = params.success;
  let _page = new Page(page);
  _page.save((err, data) => {
    err && error({ message: '页面发布失败', debug: err });
    err || success(data);
  });
};

// 批量修改页面
exports.putList = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇页面');
};

// 批量删除页面
exports.delList = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇页面');
};

// 获取单篇页面
exports.getItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 获取单篇页面');
};


// 修改单篇页面
exports.putItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 修改单篇页面');
};

// 删除单篇页面
exports.delItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇页面');
};