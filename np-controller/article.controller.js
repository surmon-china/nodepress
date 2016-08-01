/*
*
* 文章控制器模块
*
*/

// Models
var Article            = require('../np-model/article.model');

// Controllers
var categoryCtrl       = require('./category.controller');

// Common-Modules
var commonPromise      = require('../np-common');
var commonCtrlPromise  = commonPromise.commonCtrlPromise;
var commonModelPromise = commonPromise.commonModelPromise;

// 获取文章列表
exports.getList = params => {

  // 回调
  let error   = params.error;
  let success = params.success;

  // 翻页参数
  let pagination  = {
    page: Number(params.query.page || 1),
    per_page: Number(params.query.per_page || 20),
  };

  // 请求条件
  let query = {};

  // 过滤条件
  let option = {
    sort: { _id: 1 },
    page: pagination.page, 
    limit: pagination.per_page
  };

  // .populate('category')

  // 请求
  Article.paginate(query, option, (err, articles) => {
    if(err) return error({ debug: err });
    let data = {
      pagination: {
        total: articles.total,
        current_page: pagination.page,
        total_page: articles.pages,
        per_page: pagination.per_page
      },
      data: articles.docs
    };
    success(data);
  });

};

// 发布文章
exports.postItem = function(params) {

  let article = params.body;

  // 分类标签数据格式化
  !!article.tag && (article.tag = article.tag.replace(/\s/g,'').split(','));
  article.category = article.category.replace(/\s/g,'').split(',');

  let error = params.error;
  let success = params.success;

  let _article = new Article(article);
  _article.save((err, data) => {
    err && error({ message: '文章发布失败', debug: err });
    err || success(data);
  });
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
exports.getItem = params => {

  let error   = params.error;
  let success = params.success;
  let article_slug = params.params.article_slug;
  let categories = [];

  // 根据唯一别名获取文章
  Article.findOne({ slug: article_slug }, (err, article) => {
    if (err) return error({ debug: err });
    if (!err) {
      if (!article) return error({ message: '文章不存在！' });
      if (!!article) {
        if (!!article.category.length) {
          commonCtrlPromise({
            req: { params: { category_id: article.category[0] }},
            controller: categoryCtrl,
            method: 'getItem',
            success: category => {
              article.category = category;
              success(article);
            },
            error: err => { success(article) }
          });
        }
      };
    }
  });

  // Category.findById(_id, (err, article) => {
  //   if (err) return error({ debug: err });
  //   if (!err) {
  //     success(article);
  //   }
  // });
};

// 修改单篇文章
exports.putItem = function(params) {
  let error   = params.error;
  let success = params.success;
  let content = params.body || {};
  let article_id = params.params.article_id;

  // 修改前判断slug的唯一性，是否被占用
  Article.find({ slug: content.slug }, (err, data) => {
    if (err) return error({ debug: err });

    // 判断查找到的数据是否为自身
    let is_self = (!!data.length && data.length == 1 && data[0]._id == article_id);

    // 存在数据且不是自身
    if (!!data.length && !is_self) return error({ message: 'slug已被使用' });

    // 不存在数据或数据是自身
    if (!data.length || is_self) {

      Article.findByIdAndUpdate(article_id, content, function(err, category) {
        if (err) return error({ debug: err });
        if (!err) success(category);
      });
    };
  });
};

// 删除单篇文章
exports.delItem = function(params) {
  // console.log(params);
  console.log('Hello,World!, 删除单篇文章');
};