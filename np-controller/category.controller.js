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
    limit: pagination.per_page
  };

  // 请求
  Category.paginate(query, option, (err, categories) => {
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

// 发布分类
exports.postItem = params => {
  let error    = params.error;
  let success  = params.success;
  let category = params.body;
  let _category = new Category(category);
  _category.save((err, data) => {
    err && error({ debug: err });
    err || success(data);
  });
};

// 批量删除分类
exports.delList = params => {
  let error    = params.error;
  let success  = params.success;
  let categories = params.body.categories.replace(/\s/g,'').split(',');
  Category.remove({ '_id': { $in: categories } }, (err, data) => {
    err && error({ debug: err });
    err || success(data);
  }); 
};

// 获取单个分类(以及父子分类)
exports.getItem = params => {
  let error   = params.error;
  let success = params.success;
  let cate_id = params.params.category_id;
  let categories = [];
  var findCateItem = (id) => {
    Category.findOne({ id: id }, (err, category) => {
      if(err) return error({ debug: err });
      categories.unshift(category);
      let pid = category.pid;
      let ok = !!pid && pid != category.id;
      ok && findCateItem(pid);
      ok || success(categories);
    });
  };
  findCateItem(cate_id);
};

// 修改单个分类
exports.putItem = params => {
  let error   = params.error;
  let success = params.success;
  let content = params.body;
  let cate_id = params.params.category_id;
  content.pid = content.pid || 0;
  Category.findByIdAndUpdate(cate_id, content, function(err, category) {
    err && error({ debug: err });
    err || success(category);
  });
};

// 删除单个分类
exports.delItem = params => {
  let error   = params.error;
  let success = params.success;
  let cate_id = params.params.category_id;
  Category.findByIdAndRemove(cate_id, (err, category) => {
    err && error({ debug: err });
    err || success(category);
  });
};