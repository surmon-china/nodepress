/*
*
* 页面控制器模块
*
*/

// Models
const Page = require('../np-model/page.model')

// 获取页面列表
exports.getList = ({ error, success, query }) => {

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    page: Number(query.page || 1),
    limit: Number(query.per_page || 20),
    populate: ['category', 'tag']
  }

  // 请求
  Page.paginate(query, options, (err, pages) => {
    if(err) return error({ debug: err })
    success({
      pagination: {
        total: pages.total,
        current_page: options.page,
        total_page: pages.pages,
        per_page: options.limit
      },
      data: pages.docs
    })
  })
}

// 批量修改页面
exports.putList = function(params) {
  // console.log(params)
  // 比如修改访问权限，页面状态，等等
  console.log('Hello,World!, 批量修改页面')
}

// 批量删除页面
exports.delList = function(params) {
  // console.log(params)
  console.log('Hello,World!, 批量删除页面')
}

// 获取单篇页面
exports.getItem = ({ params, error, success }) => {

  Page.findOne({ id: params.page_id })
    .exec((err, page) => {
      if (err) return error({ debug: err })
      if (!page) return error({ message: '页面不存在' })
      page.password = undefined
      delete page.password
      success(page)
    })
}

// 发布页面
exports.postItem = ({ body, error, success }) => {

  // 保存页面
  const savePage = () => {

    // 分类、标签、关键词、数据格式化
    !!body.keyword && (body.keyword = Array.from(new Set(body.keyword.replace(/\s/g,'').split(','))))
    const page = new Page(body)
    page.save((err, data) => {
      err && error({ message: '页面发布失败', debug: err })
      err || success(data)
    })
  }

  // 检测Slug合法性
  if (!body.slug) return savePage()
  Page.find({ slug: body.slug }, (err, data) => {
    if (err) return error({ debug: err })
    data.length && error({ message: '页面slug已被使用' })
    data.length || savePage()
  })
}

// 修改单篇页面
exports.putItem = ({ params, body, error, success }) => {

  const page_id = params.page_id

  // 如果什么内容都没有
  if (!body || !page_id) return error({ message: '啥都没修改' })

  Page.findByIdAndUpdate(page_id, body, (err, page) => {
    if (err) return error({ debug: err })
    if (!err) success(page)
  })

  /*
  // 修改前判断slug的唯一性，是否被占用
  Page.find({ id: params.page_id }, (err, data) => {

    // 占用
    if (err) return error({ debug: err })

    // 判断查找到的数据是否为自身
    let is_self = (!!data.length && data.length == 1 && data[0]._id == page_id)

    // 存在数据且不是自身
    if (!!data.length && !is_self) return error({ message: 'slug已被使用' })

    // 不存在数据或数据是自身
    if (!data.length || is_self) {

      Page.findByIdAndUpdate(page_id, content, function(err, category) {
        if (err) return error({ debug: err })
        if (!err) success(category)
      })
    }
  })
  */
}

// 删除单篇页面
exports.delItem = ({ params, error, success }) => {
  Page.findByIdAndRemove(params.page_id, (err, page) => {
    err && error(err)
    err || success(page)
  })
}
