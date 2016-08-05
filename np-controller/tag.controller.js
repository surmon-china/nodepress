/*
*
* 标签控制器
*
*/

var Tag = require('../np-model/tag.model');

// 获取标签列表
exports.getList = params => {

  let success = params.success;
  let error   = params.error;

  Tag.find((err, tags) => {
    err && error({ message: '数据库错误' });
    if (!err) {
      let data = {
        pagination: {
          total: 10,
          current_page: 1,
          total_page: 1,
          per_page: 10,
          query: params.query
        },
        data: tags
      };
      success(data);
    }
  })
};

// 发布标签
exports.postItem = params => {

  let tag = params.body;
  let error   = params.error;
  let success = params.success;
  let _tag = new Tag(tag);
  _tag.save((err, art) => {
    err && error({ message: '标签发布失败', debug: err });
    err || success(art);
  });
};

// 批量修改标签
exports.putList = params => {
  // console.log(params);
  console.log('Hello,World!, 删除单个标签');
};

// 批量删除标签
exports.delList = params => {
  // console.log(params);
  console.log('Hello,World!, 删除单个标签');
};

// 获取单个标签
exports.getItem = params => {
  // console.log(params);
  console.log('Hello,World!, 获取单个标签');
};


// 修改单个标签
exports.putItem = params => {
  // console.log(params);
  console.log('Hello,World!, 修改单个标签');
};

// 删除单个标签
exports.delItem = params => {
  // console.log(params);
  console.log('Hello,World!, 删除单个标签');
};