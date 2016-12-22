/*
*
* 公告控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle')
const Announcement = require('../np-model/announcement.model')
let announcementCtrl = {list: {}, item: {}}

// 获取公告列表
announcementCtrl.list.GET = ({ query: { page = 1, per_page = 10, state = 'all', keyword = '' }}, res) => {

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    page: Number(page),
    limit: Number(per_page)
  }

  // query
  const query = {}
  // if (!Object.is(state, 'all')) {}

  // 请求
  Announcement.paginate({ 'content': { $in: keyword }}, options, (err, announcements) => {
    if(err) return handleError({ res, err, message: '公告列表获取失败' })
    handleSuccess({
      res,
      message: '公告列表获取成功',
      result: {
        pagination: {
          total: announcements.total,
          current_page: options.page,
          total_page: announcements.pages,
          per_page: options.limit
        },
        data: announcements.docs
      }
    })
  })
}

// 发布公告
announcementCtrl.list.POST = ({ body }, res) => {

  // 验证
  if (!body.content)
    return handleError({ res, message: '内容不合法' })

  // 保存公告
  new Announcement(body).save((err, result) => {
    err && handleError({ res, err, message: '公告发布失败' })
    err || handleSuccess({ res, result, message: '公告发布成功' })
  })
}

// 批量删除公告
announcementCtrl.list.DELETE = ({ body: { announcements }}, res) => {

  // 验证
  if (!announcements || !announcements.length)
    return handleError({ res, message: '缺少有效参数' })

  Announcement.remove({ '_id': { $in: announcements }}, (err, result) => {
    err && handleError({ res, err, message: '公告批量删除失败' })
    err || handleSuccess({ res, result, message: '公告批量删除成功' })
  })
}

// 获取单个公告
announcementCtrl.item.GET = ({ params: { announcement_id }}, res) => {
  Announcement.findById(announcement_id, (err, result) => {
    if (err || !result)
      return handleError({ res, err, message: '公告获取失败' })
    handleSuccess({ res, result, message: '公告获取成功' })
  })
}

// 修改单个公告
announcementCtrl.item.PUT = ({ params: { announcement_id }, body }, res) => {

  if (!body.content)
    return handleError({ res, message: '内容不合法' })

  Announcement.findByIdAndUpdate(announcement_id, body, (err, announcement) => {
    err && handleError({ res, err, message: '公告修改失败' })
    err || handleSuccess({ res, result: Object.assign(announcement, { content: body.content }), message: '公告修改成功' })
  })
}

// 删除单个公告
announcementCtrl.item.DELETE = ({ params: { announcement_id }}, res) => {
  Announcement.findByIdAndRemove(announcement_id, (err, announcement) => {
    err && handleError({ res, err, message: '公告删除失败' })
    err || handleSuccess({ res, result: announcement, message: '公告删除成功' })
  })
}

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: announcementCtrl.list })}
exports.item = (req, res) => { handleRequest({ req, res, controller: announcementCtrl.item })}
