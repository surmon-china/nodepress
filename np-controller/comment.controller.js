/*
*
* 评论控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const Comment = require('np-model/comment.model');
const geoip = require('geoip-lite');
const commentCtrl = { list: {}, item: {} };

// 获取评论列表
commentCtrl.list.GET = ({ query: { sort = 1, page = 1, per_page = 50, keyword = '', post_id }}, res) => {

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    page: Number(page),
    limit: Number(per_page)
  };

  // 查询参数
  let querys = {};

  // 关键词查询
  if (keyword) {
    const keywordReg = new RegExp(keyword);
    querys['$or'] = [
      { 'author.name': keywordReg },
      { 'content': keywordReg }
    ]
  };

  // 通过post-id过滤
  if (!Object.is(post_id, undefined)) {
    querys.post_id = post_id
  }

  // 请求评论
  Comment.paginate(querys, options)
  .then(comments => {
    handleSuccess({
      res,
      message: '评论列表获取成功',
      result: {
        pagination: {
          total: comments.total,
          current_page: options.page,
          total_page: comments.pages,
          per_page: options.limit
        },
        data: comments.docs
      }
    });
  })
  .catch(err => {
    handleError({ res, err, message: '评论列表获取失败' });
  })
};

// 发布评论
commentCtrl.list.POST = (req, res) => {

  let { body: comment } = req

  // 获取ip地址以及物理地理地址
  const ip = (req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress ||
             req.ip ||
             req.ips[0]).replace('::ffff:', '');
  const ip_location = geoip.lookup(ip)
  if (ip_location) {
    comment.ip_location = {
      city: ip_location.city,
      range: ip_location.range,
      country: ip_location.country
    };
  };
  comment.ip = ip;
  comment.likes = 0;
  comment.is_top = false;
  comment.agent =  req.headers['user-agent'] || comment.agent;

  console.log(comment)

  new Comment(comment).save()
  .then((result = comment) => {
    handleSuccess({ res, result, message: '评论发布成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '评论发布失败' });
  })
};

// 批量删除评论
commentCtrl.list.DELETE = ({ body: { comments }}, res) => {

  // 验证
  if (!comments || !comments.length) {
    handleError({ res, message: '缺少有效参数' });
    return false;
  };

  Comment.remove({ '_id': { $in: comments }})
  .then(result => {
    handleSuccess({ res, result, message: '评论批量删除成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '评论批量删除失败' });
  })
};

// 修改单个评论
commentCtrl.item.PUT = ({ params: { comment_id }, body: comment }, res) => {
  Comment.findByIdAndUpdate(comment_id, comment, { new: true })
  .then(result => {
    handleSuccess({ res, result, message: '评论修改成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '评论修改失败' });
  })
};

// 删除单个评论
commentCtrl.item.DELETE = ({ params: { comment_id }}, res) => {
  Comment.findByIdAndRemove(comment_id)
  .then(result => {
    handleSuccess({ res, result, message: '评论删除成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '评论删除失败' });
  })
};

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: commentCtrl.list })};
exports.item = (req, res) => { handleRequest({ req, res, controller: commentCtrl.item })};
