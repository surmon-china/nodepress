/*
*
* 评论控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const { akismetClient } = require('np-utils/np-akismet');
const { sendMail } = require('np-utils/np-email');
const Comment = require('np-model/comment.model');
const authIsVerified = require('np-utils/np-auth');
const geoip = require('geoip-lite');
const commentCtrl = { list: {}, item: {} };


// 获取评论列表
commentCtrl.list.GET = (req, res) => {

  let { sort = 1, page = 1, per_page = 50, keyword = '', post_id } = req.query;

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    page: Number(page),
    limit: Number(per_page)
  };

  // 排序字段
  sort = Number(sort);

  if ([-1, 1].includes(sort)) {
    options.sort = { _id: sort };
  } else if (Object.is(sort, 2)) {
    options.sort = { likes: -1 };
  };

  // 查询参数
  let querys = {};

  // 如果是前台请求，则重置公开状态和发布状态
  if (!authIsVerified(req)) {
    querys.state = 1;
  };

  // 关键词查询
  if (keyword) {
    const keywordReg = new RegExp(keyword);
    querys['$or'] = [
      { 'content': keywordReg },
      { 'author.name': keywordReg },
      { 'author.email': keywordReg }
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

  // 连接
  const permalink = `https://surmon.me/` + 
                   Object.is(comment.post_id, 0) ? 'guestbook' : `article/${comment.post_id}`

  // 发布评论
  const saveComment = () => {
    new Comment(comment).save()
    .then((result = comment) => {
      handleSuccess({ res, result, message: '评论发布成功' });
      // 发布成功后，向网站主及被回复者发送邮件提醒
      sendMail({
        to: 'surmon@foxmail.com',
        subject: '博客有新的留言',
        text: `来自 ${comment.author.name} 的留言：${comment.content}`,
        html: `<p> 来自 ${comment.author.name} 的留言：${comment.content}</p>
              <a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
      });
      if (!!comment.pid) {
        Comment.findOne({ id: comment.pid }).then(parentComment => {
          sendMail({
            to: parentComment.author.email,
            subject: '你在Surmon.me有新的评论回复',
            text: `来自 ${comment.author.name} 的评论回复：${comment.content}`,
            html: `<p> 来自${comment.author.name} 的评论回复：${comment.content}</p>
              <a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
          });
        }).catch(err => {
          console.log('未找到对应评论数据')
        })
      }
    })
    .catch(err => {
      handleError({ res, err, message: '评论发布失败' });
    })
  };

  // 使用akismet过滤
  akismetClient.checkSpam({
    user_ip: comment.ip,
    user_agent: comment.agent,
    referrer: req.headers.referer,
    permalink,
    comment_type: 'comment',
    comment_author: comment.author.name,
    comment_author_email: comment.author.email,
    comment_author_url: comment.author.site,
    comment_content: comment.content,
    // is_test : true
  }).then(span => {
    saveComment();
  }).catch(err => {
    handleError({ res, err: 'spam!', message: '评论发布失败' });
  })

  // 读取设置的黑名单ip/邮箱/关键词过滤
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
