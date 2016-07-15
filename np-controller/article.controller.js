/*
*
* 文章控制器模块
*
*/

var Article = require('../np-model/article.model');

// 获取文章列表
exports.getList = params => {

  let success = params.success;
  let error   = params.error;

  Article.find((err, articles) => {
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
        data: articles
      };
      success(data);
    }
  })
};

// 发布文章
exports.postItem = function(params) {

  let article = params.body;
  // let is_valid = article.title && article.content;
  let is_valid = article.title && article.content && article.author && article.date && article.category && article.category.length;

  let error = params.error;
  let success = params.success;

  if (!is_valid) return error({ message: '缺少必要字段' });
  if (is_valid) {

    let _article = new Article(article);
    _article.save((err, art) => {
      err && error({ message: '文章发布失败', debug: err });
      err || success(art);
    });
  };  
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