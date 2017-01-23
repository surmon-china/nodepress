/*
 *
 * 文章控制器
 *
 */

const { handleRequest, handleError, handleSuccess } = require('../np-handle')
const Article = require('../np-model/article.model')
let articleCtrl = {list: {}, item: {}}

// 获取文章列表
articleCtrl.list.GET = ({ query: { page = 1, per_page = 10, state, public, keyword, category, tag }}, res) => {

  // 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(page),
    limit: Number(per_page),
    populate: ['category', 'tag']
  }

  // 查询参数
  let query = {}

  // 按照state查询
  if (['0', '1', '-1'].includes(state)) {
    query.state = state
  }

  // 按照公开程度查询
  if (['0', '1', '-1'].includes(public)) {
    query.public = public
  }

  // 关键词查询
  if (keyword) {
    const keywordReg = new RegExp(keyword)
    query['$or'] = [
      { 'title': keywordReg },
      { 'content': keywordReg },
      { 'description': keywordReg }
    ]
  }

  // 分类查询
  if (category) {

  }

  // 标签查询

  console.log(query)

  // 请求
  Article.paginate(query, options, (err, articles) => {
    if (err) {
      return handleError({ res, err, message: '文章列表获取失败' })
    }
    handleSuccess({
      res,
      message: '文章列表获取成功',
      result: {
        pagination: {
          total: articles.total,
          current_page: options.page,
          total_page: articles.pages,
          per_page: options.limit
        },
        data: articles.docs
      }
    })
  })
}

// 发布文章
articleCtrl.list.POST = ({ body: article }, res) => {

  // 验证
  if (!article.title || !article.content) {
    return handleError({ res, message: '内容不合法' })
  }

  // 保存文章
  new Article(article).save((err, result) => {
    err && handleError({ res, err, message: '文章发布失败' })
    err || handleSuccess({ res, result, message: '文章发布成功' })
  })
}

// 批量删除文章
articleCtrl.list.DELETE = ({ body: { articles }}, res) => {

  // 验证
  if (!articles || !articles.length)
    return handleError({ res, message: '缺少有效参数' })

  Article.remove({ '_id': { $in: articles }}, (err, result) => {
    err && handleError({ res, err, message: '文章批量删除失败' })
    err || handleSuccess({ res, result, message: '文章批量删除成功' })
  })
}

// 获取单个文章
articleCtrl.item.GET = ({ params: { article_id }}, res) => {
  Article.findById(article_id, (err, result) => {
    if (err || !result)
      return handleError({ res, err, message: '文章获取失败' })
    handleSuccess({ res, result, message: '文章获取成功' })
  })
}

// 修改单个文章
articleCtrl.item.PUT = ({ params: { article_id }, body: article }, res) => {

  // 验证
  if (!article.title || !article.content) {
    return handleError({ res, message: '内容不合法' })
  }

  // 修改文章
  Article.findByIdAndUpdate(article_id, article, (err, _article) => {
    err && handleError({ res, err, message: '文章修改失败' })
    err || handleSuccess({ res, result: Object.assign(_article, article), message: '文章修改成功' })
  })
}

// 删除单个文章
articleCtrl.item.DELETE = ({ params: { article_id }}, res) => {
  Article.findByIdAndRemove(article_id, (err, article) => {
    err && handleError({ res, err, message: '文章删除失败' })
    err || handleSuccess({ res, result: article, message: '文章删除成功' })
  })
}

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: articleCtrl.list })}
exports.item = (req, res) => { handleRequest({ req, res, controller: articleCtrl.item })}
