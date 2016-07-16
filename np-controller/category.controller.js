/*
*
* 分类分类控制器
*
*/

var Category = require('../np-model/category.model');

// 获取分类列表
exports.getList = params => {

  let success = params.success;
  let error   = params.error;

  Category.find((err, categorys) => {
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
        data: categorys
      };
      success(data);
    }
  })
};

// 发布分类
exports.postItem = params => {

  let category = params.body;
  let is_valid = !!category.name && !!category.slug;

  let error   = params.error;
  let success = params.success;

  if (!is_valid) return error({ message: '缺少必要字段' });
  if (is_valid) {

    let _category = new Category(category);
    _category.save((err, art) => {
      err && error({ message: '分类发布失败', debug: err });
      err || success(art);
    });
  };  
};

// 批量修改分类
exports.putList = params => {
  // console.log(params);
  console.log('Hello,World!, 删除单个分类');
};

// 批量删除分类
exports.delList = params => {
  // console.log(params);
  console.log('Hello,World!, 删除单个分类');
};

// 获取单个分类
exports.getItem = params => {
  // console.log(params);
  console.log('Hello,World!, 获取单个分类');
};


// 修改单个分类
exports.putItem = params => {
  // console.log(params);
  console.log('Hello,World!, 修改单个分类');
};

// 删除单个分类
exports.delItem = params => {
  // console.log(params);
  console.log('Hello,World!, 删除单个分类');
};