/*
 *
 * 公告控制器
 *
 */

const authIsVerified = require('np-utils/np-auth');
const Announcement = require('np-model/announcement.model');

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const announcementCtrl = { list: {}, item: {} };

// 获取公告列表
announcementCtrl.list.GET = (req, res) => {

  let { page = 1, per_page = 10, state, keyword = '' } = req.query;

  // 过滤条件
  const options = {
    sort: { _id: -1 },
    page: Number(page),
    limit: Number(per_page)
  };

  // 查询参数
  const querys = { 
    'content': new RegExp(keyword)
  };
  
  // 按照type查询
  if (['0', '1'].includes(state)) {
    querys.state = state;
  };

  // 如果是前台请求，则重置公开状态和发布状态
  if (!authIsVerified(req)) {
    querys.state = 1;
  }

  // 请求
  Announcement.paginate(querys, options)
  .then(announcements => {
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
    });
  })
  .catch(err => {
    handleError({ res, err, message: '公告列表获取失败' });
  })
};

// 发布公告
announcementCtrl.list.POST = ({ body: announcement }, res) => {
  new Announcement(announcement).save()
  .then((result = announcement) => {
    handleSuccess({ res, result, message: '公告发布成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '公告发布失败' });
  })
};

// 批量删除公告
announcementCtrl.list.DELETE = ({ body: { announcements }}, res) => {

  // 验证
  if (!announcements || !announcements.length) {
    handleError({ res, message: '缺少有效参数' });
    return false;
  };

  // 删除
  Announcement.remove({ '_id': { $in: announcements }})
  .then(result => {
    handleSuccess({ res, result, message: '公告批量删除成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '公告批量删除失败' });
  })
};

// 修改单个公告
announcementCtrl.item.PUT = ({ params: { announcement_id }, body: announcement }, res) => {

  if (!announcement.content) {
    handleError({ res, message: '内容不合法' });
    return false;
  };

  Announcement.findByIdAndUpdate(announcement_id, announcement, { new: true })
  .then(result => {
    handleSuccess({ res, result, message: '公告修改成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '公告修改失败' });
  })
};

// 删除单个公告
announcementCtrl.item.DELETE = ({ params: { announcement_id }}, res) => {
  Announcement.findByIdAndRemove(announcement_id)
  .then(result => {
    handleSuccess({ res, result, message: '公告删除成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '公告删除失败' });
  })
};

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: announcementCtrl.list })};
exports.item = (req, res) => { handleRequest({ req, res, controller: announcementCtrl.item })};
