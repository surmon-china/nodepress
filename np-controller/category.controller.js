/*
*
* 分类分类控制器
*
*/

var Category = require('../np-model/category.model');

// 获取分类列表
exports.getList = params => {

  // 回调
  let error   = params.error;
  let success = params.success;

  // 翻页参数
  let pagination  = {
    page: Number(params.query.page || 1),
    per_page: Number(params.query.per_page || 10),
  };

  // 请求条件
  let query = {};

  // 过滤条件
  let option = {
    sort: { _id: 1 },
    page: pagination.page, 
    limit: pagination.per_page,
    // select:   'title date author',
    // populate: 'children',
    // lean:     true,
    // offset:   20,
  };

  // 请求
  Category.paginate(query, option, (err, categories) => {
    if(err) return error({ message: '数据库错误' });
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
  })

  /*
  Category.find({})
  .sort({ '_id': 1 })
  .skip((pagination.page - 1) * pagination.per_page)
  .limit(pagination.per_page)
  .exec((err, categorys) => {
    err && error({ message: '数据库错误' });
    if (!err) {
      let data = {
        pagination: {
          total: 10,
          current_page: pagination.page,
          total_page: 1,
          per_page: pagination.per_page
        },
        data: categorys
      };
      success(data);
    }
  })
  */
  
};

// 发布分类
exports.postItem = params => {
  let error    = params.error;
  let success  = params.success;
  let category = params.body;
  let _category = new Category(category);
  _category.save((err, data) => {
    err && error({ message: '分类发布失败', debug: err });
    err || success(data);
  });
};

// 批量删除分类
exports.delList = params => {
  let error    = params.error;
  let success  = params.success;
  let categories = params.body.categories;

  console.log(categories);

  return false;

  let _category = new Category(category);

  console.log('Hello,World!, 删除单个分类');

  _category.save((err, data) => {
    err && error({ message: '分类发布失败', debug: err });
    err || success(data);
  });
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