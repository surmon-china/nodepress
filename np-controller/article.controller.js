/*
 *
 * 文章控制器
 *
 */

const { handleRequest, handleError, handleSuccess } = require('../np-handle')
const Article = require('../np-model/article.model')
let articleCtrl = {list: {}, item: {}}

// 获取文章列表
articleCtrl.list.GET = ({ query: { page = 1, per_page = 10, state, keyword = '' }}, res) => {

  // 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(page),
    limit: Number(per_page),
    populate: ['category', 'tag']
  }

  // 查询参数
  const query = { 'content': new RegExp(keyword) }
  
  // 按照type查询
  if (['0', '1'].includes(state)) {
    query.state = state
  }

  // 请求
  Article.paginate(query, options, (err, articles) => {
    if(err) return handleError({ res, err, message: '文章列表获取失败' })
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
articleCtrl.list.POST = ({ body }, res) => {

  // 验证
  if (!body.content)
    return handleError({ res, message: '内容不合法' })

  // 保存文章
  new Article(body).save((err, result) => {
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
articleCtrl.item.PUT = ({ params: { article_id }, body }, res) => {

  if (!body.content)
    return handleError({ res, message: '内容不合法' })

  Article.findByIdAndUpdate(article_id, body, (err, article) => {
    err && handleError({ res, err, message: '文章修改失败' })
    err || handleSuccess({ res, result: Object.assign(article, { content: body.content }), message: '文章修改成功' })
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



// ----------------------------------------------------------------------



// 批量修改文章
exports.putList = function(params) {
  // console.log(params)
  console.log('Hello,World!, 批量修改文章')
}

// 批量删除文章
exports.delList = function(params) {
  // console.log(params)
  console.log('Hello,World!, 批量删除文章')
}

// 获取单篇文章
exports.getItem = ({ params, error, success }) => {

  Article
    .findOne({ id: params.article_id })
    .populate(['category', 'tag'])
    .exec((err, article) => {
      if (err) return error({ debug: err })
      if (!article) return error({ message: '文章不存在' })
      article.password = undefined
      delete article.password
      success(article)
    })
}

// 发布文章
exports.postItem = ({ body, error, success }) => {

  // 保存文章
  const saveArticle = () => {

    // 分类、标签、关键词、数据格式化
    !!body.tag && (body.tag = Array.from(new Set(body.tag.replace(/\s/g,'').split(','))))
    !!body.keyword && (body.keyword = Array.from(new Set(body.keyword.replace(/\s/g,'').split(','))))
    !!body.category && (body.category = Array.from(new Set(body.category.replace(/\s/g,'').split(','))))

    const article = new Article(body)
    article.save((err, data) => {
      err && error({ message: '文章发布失败', debug: err })
      err || success(data)
    })
  }

  // 检测Slug合法性
  if (!body.slug) return saveArticle()
  Article.find({ slug: body.slug }, (err, data) => {
    if (err) return error({ debug: err })
    data.length && error({ message: '文章slug已被使用' })
    data.length || saveArticle()
  })
}

// 修改单篇文章
exports.putItem = ({ params, body, error, success }) => {

  const article_id = params.article_id

  // 如果什么内容都没有
  if (!body || !article_id) return error({ message: '啥都没修改' })

  Article.findByIdAndUpdate(article_id, body, (err, article) => {
    if (err) return error({ debug: err })
    if (!err) success(article)
  })

  /*
  // 修改前判断slug的唯一性，是否被占用
  Article.find({ id: params.article_id }, (err, data) => {

    // 占用
    if (err) return error({ debug: err })

    // 判断查找到的数据是否为自身
    let is_self = (!!data.length && data.length == 1 && data[0]._id == article_id)

    // 存在数据且不是自身
    if (!!data.length && !is_self) return error({ message: 'slug已被使用' })

    // 不存在数据或数据是自身
    if (!data.length || is_self) {

      Article.findByIdAndUpdate(article_id, content, function(err, category) {
        if (err) return error({ debug: err })
        if (!err) success(category)
      })
    }
  })
  */
}

// 删除单篇文章
exports.delItem = ({ params, error, success }) => {
  Article.findByIdAndRemove(params.article_id, (err, article) => {
    err && error(err)
    err || success(article)
  })
}
