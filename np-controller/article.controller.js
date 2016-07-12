/*
*
* 文章控制器模块
*
*/

var Article = require('../np-model/article.model').article;
require('express-mongoose');

// 获取文章列表
exports.getList = function(params) {

  Article.find((err) => {
    console.log('asasd');
  })

  let data = {
    pagination: {
      total: 10,
      current_page: 1,
      total_page: 1,
      per_page: 10,
      query: params.query
    },
    // data: Article.find()
  };
  let cb = params.success;
  let er = params.error;
  cb && cb(data);
  // er && er(data);
};

// 发布文章
exports.postItem = function(params) {
  let newArticle = params.body;
  if (!newArticle.title || !newArticle.content || !newArticle.author || !newArticle.date || !newArticle.category || !newArticle.category.length ) {
    if (params.error) params.error({ message: '缺少必要字段' });
    return false;
  } else {
    if (params.success) params.success(newArticle);
  }
};

// 批量修改文章
exports.putList = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇文章');
};

// 批量删除文章
exports.delList = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇文章');
};

// 获取单篇文章
exports.getItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 获取单篇文章');
};


// 修改单篇文章
exports.putItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 修改单篇文章');
};

// 删除单篇文章
exports.delItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇文章');
};