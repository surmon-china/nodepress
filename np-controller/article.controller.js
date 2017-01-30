/*
 *
 * 文章控制器
 *
 */

const { handleRequest, handleError, handleSuccess } = require('../np-handle');
const Article = require('../np-model/article.model');
const htmlToText = require('html-to-text');
const articleCtrl = { list: {}, item: {} };

// 获取文章列表
articleCtrl.list.GET = ({ query: { page = 1, per_page = 10, state, public, keyword, category, tag }}, res) => {

  // 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(page),
    limit: Number(per_page),
    populate: ['category', 'tag']
  };

  // 查询参数
  let query = {};

  // 按照state查询
  if (['0', '1', '-1'].includes(state)) {
    query.state = state;
  };

  // 按照公开程度查询
  if (['0', '1', '-1'].includes(public)) {
    query.public = public;
  };

  // 关键词查询
  if (keyword) {
    const keywordReg = new RegExp(keyword);
    query['$or'] = [
      { 'title': keywordReg },
      { 'content': keywordReg },
      { 'description': keywordReg }
    ]
  };

  // 标签查询
  if (tag) {
    query.tag = tag;
  };

  // 分类查询
  if (category) {
    query.category = category;
  };

  // 请求
  Article.paginate(query, options)
  .then(articles => {
    handleSuccess({
      res,
      message: '文章列表获取成功',
      result: {
        pagination: {
          total: articles.total,
          current_page: articles.page,
          total_page: articles.pages,
          per_page: articles.limit
        },
        data: articles.docs.map(article => {
          article.content = htmlToText.fromString(article.t_content);
          article.password = '';
          return article;
        })
      }
    })
  })
  .catch(err => {
    handleError({ res, err, message: '文章列表获取失败' });
  })
};

// 发布文章
articleCtrl.list.POST = ({ body: article }, res) => {

  // 验证
  if (!article.title || !article.content) {
    handleError({ res, message: '内容不合法' });
    return false;
  };

  // 保存文章
  new Article(article).save()
  .then((result = article) => {
    handleSuccess({ res, result, message: '文章发布成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '文章发布失败' });
  })
};

// 批量修改文章（移回收站、回收站恢复）
articleCtrl.list.PUT = ({ body: { articles, params: { action }}}, res) => {

  // 验证
  if (!articles || !articles.length) {
    handleError({ res, message: '缺少有效参数' });
    return false;
  };

  // 要改的数据
  let updatePart = {};

  switch (action) {
    // 移至回收站
    case 1:
      updatePart.state = -1;
      break;
    // 移至草稿
    case 2:
      updatePart.state = 0;
      break;
    // 移至已发布
    case 3:
      updatePart.state = 1;
      break;
    default:
      break;
  };

  Article.update({ '_id': { $in: articles }}, { $set: updatePart }, { multi: true })
  .then(result => {
    handleSuccess({ res, result, message: '文章批量删除成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '文章批量删除失败' });
  })
};

// 批量删除文章
articleCtrl.list.DELETE = ({ body: { articles }}, res) => {

  // 验证
  if (!articles || !articles.length) {
    handleError({ res, message: '缺少有效参数' });
    return false;
  }

  Article.remove({ '_id': { $in: articles }})
  .then(result => {
    handleSuccess({ res, result, message: '文章批量删除成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '文章批量删除失败' });
  })
};

// 获取单个文章
articleCtrl.item.GET = ({ params: { article_id }}, res) => {
  Article.findById(article_id)
  .then(result => {
    handleSuccess({ res, result, message: '文章获取成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '文章获取失败' });
  })
};

// 修改单个文章
articleCtrl.item.PUT = ({ params: { article_id }, body: article }, res) => {

  // 验证
  if (!article.title || !article.content) {
    handleError({ res, message: '内容不合法' });
    return false;
  };

  // 修改文章
  Article.findByIdAndUpdate(article_id, article, { new: true })
  .then(result => {
    handleSuccess({ res, result, message: '文章修改成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '文章修改失败' });
  })
};

// 删除单个文章
articleCtrl.item.DELETE = ({ params: { article_id }}, res) => {
  Article.findByIdAndRemove(article_id)
  .then(result => {
    handleSuccess({ res, result, message: '文章删除成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '文章删除失败' });
  })
};

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: articleCtrl.list })};
exports.item = (req, res) => { handleRequest({ req, res, controller: articleCtrl.item })};
