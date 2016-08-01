/*
*
* 文章控制器模块
*
*/

// Models
var Article            = require('../np-model/article.model');

// Controllers
var categoryCtrl       = require('./category.controller');

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
    limit: pagination.per_page,
    populate: ['category', 'tag']
  };

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
  let error = params.error;
  let success = params.success;
  let article = params.body;

  // 保存文章
  let saveArticle = () => {

    // 分类、标签、关键词、数据格式化
    !!article.tag && (article.tag =  Array.from(new Set(article.tag.replace(/\s/g,'').split(','))));
    !!article.keyword && (article.keyword = Array.from(new Set(article.keyword.replace(/\s/g,'').split(','))));
    !!article.category && (article.category = Array.from(new Set(article.category.replace(/\s/g,'').split(','))));

    let _article = new Article(article);
    _article.save((err, data) => {
      err && error({ message: '文章发布失败', debug: err });
      err || success(data);
    });
  };

  // 检测Slug合法性
  Article.find({ slug: article.slug }, (err, data) => {
    if (err) return error({ debug: err });
    data.length && error({ message: 'slug已被使用' });
    data.length || saveArticle();
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
  let slug = params.params.article_slug;

  // 根据文章ID获取评论
  let getCommentsByArticle = article_id => {
    console.log('获取评论信息');
  };

  // 根据唯一别名获取文章
  let getArticleBySlug = slug => {
    Article
    .findOne({ slug: slug })
    .populate(['category', 'tag'])
    .exec((err, article) => {
      if (err) return error({ debug: err });
      if (!article) error({ message: '文章不存在' });
      if (!!article) {
        article.password = undefined;
        delete article.password;
        getCommentsByArticle();
        success(article);
      };
    });
  };

  // 根据自增ID获取文章
  let getArticleById = id => {
    return new Promise((resolve, reject) => {
      Category.findOne({ id: id }, (err, article) => {
        err && reject(err);
        err || resolve(article);
      });
    });
  };

  // 获取文章
  getArticleBySlug(slug);
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