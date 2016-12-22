/*
*
* 页面控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle')
const Page = require('../np-model/page.model')
let pageCtrl = {list: {}, item: {}}

// 获取页面列表
pageCtrl.list.GET = ({ query: { page = 1, per_page = 12 }}, res) => {

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    page: Number(page),
    limit: Number(per_page)
  }

  // 请求
  Page.paginate({}, options, (err, pages) => {
    if(err) return handleError({ res, err, message: '页面列表获取失败' })
    handleSuccess({
      res,
      message: '页面列表获取成功',
      result: {
        pagination: {
          total: pages.total,
          current_page: options.page,
          total_page: pages.pages,
          per_page: options.limit
        },
        data: pages.docs
      }
    })
  })
}

// 发布页面
pageCtrl.list.POST = ({ body }, res) => {

  // 验证
  if (body.slug == undefined)
    return handleError({ res, message: '缺少slug' })

  // 保存页面
  const savePage = () => {
    new Page(body).save((err, result) => {
      err && handleError({ res, err, message: '页面发布失败' })
      err || handleSuccess({ res, result, message: '页面发布成功' })
    })
  }

  // 验证Slug合法性
  Page.find({ slug: body.slug }, (err, pages) => {
    if (err) return handleError({ res, err, message: '页面发布失败' })
    pages.length && handleError({ res, message: 'slug已被占用' })
    pages.length || savePage()
  })
}

// 批量删除页面
pageCtrl.list.DELETE = ({ body: { pages }}, res) => {

  // 验证
  if (!pages || !pages.length)
    return handleError({ res, message: '缺少有效参数' })

  Page.remove({ '_id': { $in: pages } }, (err, result) => {
    err && handleError({ res, err, message: '页面批量删除失败' })
    err || handleSuccess({ res, result, message: '页面批量删除成功' })
  })
}

// 获取单个页面
pageCtrl.item.GET = ({ params: { page_id } }, res) => {
  Page.findById(page_id, (err, page) => {
    if(err || !page) return handleError({ res, err, message: err ? '页面获取失败' : '页面不存在' })
    handleSuccess({ res, result: pages, message: '页面获取成功' })
  })
}

// 修改单个页面
pageCtrl.item.PUT = ({ params: { page_id }, body, body: { slug }}, res) => {

  if (!slug) return handleError({ res, message: 'slug不合法' })

  // 修改
  const putPage = () => {
    Page.findByIdAndUpdate(page_id, body, (err, page) => {
      err && handleError({ res, err, message: '页面修改失败' })
      err || handleSuccess({ res, result: page, message: '页面修改成功' })
    })
  }

  // 修改前判断slug的唯一性，是否被占用
  Page.find({ slug }, (err, pages) => {
    if (err) return handleError({ res, err, message: '页面修改失败' })
    const canPut = (!pages.length || (!!pages.length && Object.is(pages.length, 1) && pages[0]._id == page_id))
    canPut ? putPage() : handleError({ res, err, message: '修改失败，slug已被使用' })
  })
}

// 删除单个页面
pageCtrl.item.DELETE = ({ params: { page_id }}, res) => {
  Page.findByIdAndRemove(page_id, (err, result) => {
    if (err) return handleError({ res, err, message: '页面删除失败' })
    handleSuccess({ res, result, message: '页面删除成功' })
  })
}

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: pageCtrl.list })}
exports.item = (req, res) => { handleRequest({ req, res, controller: pageCtrl.item })}
