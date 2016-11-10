/*
*
* 文章控制器模块
*
*/

// Models
const Article = require('../np-model/article.model')

// Controllers
const CategoryCtrl = require('./category.controller')

// 获取文章列表
exports.getList = ({ error, success, query }) => {

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    page: Number(query.page || 1),
    limit: Number(query.per_page || 20),
    populate: ['category', 'tag']
  }

  // 请求
  Article.paginate(query, options, (err, articles) => {
    if(err) return error({ debug: err })
    success({
      pagination: {
        total: articles.total,
        current_page: options.page,
        total_page: articles.pages,
        per_page: options.limit
      },
      data: articles.docs
    })
  })
}

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
