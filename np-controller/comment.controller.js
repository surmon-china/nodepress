/*
*
* 评论控制器
*
*/

var Comment           = require('../np-model/comment.model');
var commonModelPromise = require('../np-common').commonModelPromise;

// 获取评论列表
exports.getList = params => {

  // 回调
  let error   = params.error;
  let success = params.success;

  // 翻页参数
  let pagination  = {
    page: Number(params.query.page || 1),
    per_page: Number(params.query.per_page || 30),
  };

  // 请求条件
  let query = {};

  // 过滤条件
  let option = {
    sort: { _id: 1 },
    page: pagination.page, 
    limit: pagination.per_page
  };

  // 请求
  Comment.paginate(query, option, (err, categories) => {
    if(err) return error({ debug: err });
    let data = {
      pagination: {
        total: categories.total,
        current_page: pagination.page,
        total_page: categories.pages,
        per_page: pagination.per_page
      },
      data: categories.docs
    };
    success(data);
  });
};

// 发布评论
exports.postItem = params => {
  let error    = params.error;
  let success  = params.success;
  let comment = params.body;
  Comment.find({ slug: comment.slug }, (err, data) => {
    if (err) return error({ debug: err });
    if (!!data.length) return error({ message: 'slug已被使用' });
    if (!data.length) {
      let _comment = new Comment(comment);
      _comment.save((err, data) => {
        err && error({ debug: err });
        err || success(data);
      });
    };
  });
};

// 批量删除评论
exports.delList = params => {
  let error    = params.error;
  let success  = params.success;
  let categories = params.body.categories.replace(/\s/g,'').split(',');
  Comment.remove({ '_id': { $in: categories } }, (err, data) => {
    err && error({ debug: err });
    err || success(data);
  }); 
};

// 获取单个评论(以及父子评论)
exports.getItem = params => {
  let error   = params.error;
  let success = params.success;
  let cate_id = params.params.comment_id;
  let categories = [];
  var findCateItem = (_id) => {
    Comment.findById(_id, (err, comment) => {
      if(err) return error({ debug: err });
      if (!comment) return error({ message: '评论不存在' });
      categories.unshift(comment);
      let pid = comment.pid;
      let ok = !!pid && pid != comment.id;
      ok && findCateItem(pid);
      ok || success(categories);
    });
  };
  findCateItem(cate_id);
};

// 修改单个评论
exports.putItem = params => {
  let error   = params.error;
  let success = params.success;
  let content = params.body || {};
  let cate_id = params.params.comment_id;

  // 修改前判断slug的唯一性，是否被占用
  Comment.find({ slug: content.slug }, (err, data) => {
    if (err) return error({ debug: err });

    // 判断查找到的数据是否为自身
    let is_self = (!!data.length && data.length == 1 && data[0]._id == cate_id);

    // 存在数据且不是自身
    if (!!data.length && !is_self) return error({ message: 'slug已被使用' });

    // 不存在数据或数据是自身
    if (!data.length || is_self) {

      // 未占用，则修改
      let cate_pid = content.pid;
      if (cate_pid == '0' || cate_pid == 'null' || cate_pid == 'false' || !cate_pid || cate_pid == cate_id) cate_pid = null;
      content.pid = cate_pid;
      Comment.findByIdAndUpdate(cate_id, content, function(err, comment) {
        if (err) return error({ debug: err });
        if (!err) {
          comment.pid = content.pid;
          success(comment);
        };
      });
    };
  });
};

// 删除单个评论
exports.delItem = params => {
  let error   = params.error;
  let success = params.success;
  let cate_id = params.params.comment_id;

  // 删除评论
  Comment.findByIdAndRemove(cate_id, (err, _comment) => {
    if (err) return error({ debug: err });

    // 删除此评论的所有子评论的pid
    Comment.find({ pid: cate_id }, (err, data) => {
      let cate_ids = [];
      data.forEach(cate => { cate_ids.push(cate._id) });
      if (!!cate_ids.length) {
        let comment = Comment.collection.initializeOrderedBulkOp();
        comment.find({ '_id': { $in: cate_ids } }).update({ $set: { pid: _comment.pid || null }});
        comment.execute(function (err, data) {
          // console.log(err, data);
          if (!err) success(_comment);
        });
      } else {
        success(_comment);
      }
    });
  });
};