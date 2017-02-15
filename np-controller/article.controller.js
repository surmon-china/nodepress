/*
 *
 * 文章控制器
 *
 */

const { handleRequest, handleError, handleSuccess } = require('../np-handle');
const Category = require('../np-model/category.model');
const Article = require('../np-model/article.model');
const Tag = require('../np-model/tag.model');
const htmlToText = require('html-to-text');
const authIsVerified = require('../np-auth');
const buildSiteMap = require('../np-sitemap');
const articleCtrl = { list: {}, item: {} };

// 获取文章列表
articleCtrl.list.GET = (req, res) => {

  let { page, per_page, state, public, keyword, category, category_slug, tag, tag_slug, date } = req.query;

  // 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(page || 1),
    limit: Number(per_page || 10),
    populate: ['category', 'tag'],
    select: '-password -content'
  };

  // 查询参数
  let querys = {};

  // 按照state查询
  if (['0', '1', '-1'].includes(state)) {
    querys.state = state;
  };

  // 按照公开程度查询
  if (['0', '1', '-1'].includes(public)) {
    querys.public = public;
  };

  // 关键词查询
  if (keyword) {
    const keywordReg = new RegExp(keyword);
    querys['$or'] = [
      { 'title': keywordReg },
      { 'content': keywordReg },
      { 'description': keywordReg }
    ]
  };

  // 标签id查询
  if (tag) {
    querys.tag = tag;
  };

  // 分类id查询
  if (category) {
    querys.category = category;
  };

  // 时间查询
  if (date) {
    const gteDate = new Date(date);
    if(!Object.is(gteDate, 'Invalid Date')) {
      querys.create_time = {
        "$gte": new Date((gteDate / 1000 - 60 * 60 * 8) * 1000),
        "$lt": new Date((gteDate / 1000 + 60 * 60 * 16) * 1000)
      }
    }
  };

  // 如果是前台请求，则重置公开状态和发布状态
  if (!authIsVerified(req)) {
    querys.state = 1;
    querys.public = 1;
  };

  // 请求对应文章
  const getArticles = () => {
    Article.paginate(querys, options)
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
          data: articles.docs
        }
      })
    })
    .catch(err => {
      handleError({ res, err, message: '文章列表获取失败' });
    })
  };

  // 分类别名查询 - 根据别名查询到id，然后根据id查询
  if (category_slug) {
    Category.find({ slug: category_slug })
    .then(([category] = []) => {
      if (category) {
        querys.category = category._id;
        getArticles();
      } else {
        handleError({ res, message: '分类不存在' });
      }
    })
    .catch(err => {
      handleError({ res, err, message: '分类查找失败' });
    })
    return false;
  };
  
  // 标签别名查询 - 根据别名查询到id，然后根据id查询
  if (tag_slug) {
    Tag.find({ slug: tag_slug })
    .then(([tag] = []) => {
      if (tag) {
        querys.tag = tag._id;
        getArticles();
      } else {
        handleError({ res, message: '标签不存在' });
      }
    })
    .catch(err => {
      handleError({ res, err, message: '标签查找失败' });
    })
    return false;
  };

  // 默认请求文章列表
  getArticles();
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
    buildSiteMap();
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
    handleSuccess({ res, result, message: '文章批量操作成功' });
    buildSiteMap();
  })
  .catch(err => {
    handleError({ res, err, message: '文章批量操作失败' });
  })
};

// 批量删除文章
articleCtrl.list.DELETE = ({ body: { articles }}, res) => {

  // 验证
  if (!articles || !articles.length) {
    handleError({ res, message: '缺少有效参数' });
    return false;
  };

  Article.remove({ '_id': { $in: articles }})
  .then(result => {
    handleSuccess({ res, result, message: '文章批量删除成功' });
    buildSiteMap();
  })
  .catch(err => {
    handleError({ res, err, message: '文章批量删除失败' });
  })
};

// 获取单个文章
articleCtrl.item.GET = ({ params: { article_id }}, res) => {

  // 判断来源
  const isFindById = !Object.is(Number(article_id), NaN);

  // 获取相关文章
  const getRelatedArticles = result => {
    Article.find(
      { state: 1, public: 1, tag: { $in: result.tag.map(t => t._id) }}, 
      'id title description thumb -_id', 
      (err, articles) => {
        result.related = err ? [] : articles;
        handleSuccess({ res, result, message: '文章获取成功' });
      })
  };

  (isFindById
    ? Article.findOne({ id: Number(article_id), state: 1, public: 1 }).populate('category tag').exec()
    : Article.findById(article_id)
  )
  .then(result => {
    // 每请求一次，浏览次数都要增加
    if (isFindById) {
      result.meta.views += 1;
      result.save();
    }
    if (isFindById && result.tag.length) {
      getRelatedArticles(result.toObject());
    } else {
      handleSuccess({ res, result, message: '文章获取成功' });
    }
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
    buildSiteMap();
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
    buildSiteMap();
  })
  .catch(err => {
    handleError({ res, err, message: '文章删除失败' });
  })
};

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: articleCtrl.list })};
exports.item = (req, res) => { handleRequest({ req, res, controller: articleCtrl.item })};
