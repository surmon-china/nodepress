// 翻页示例
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
});
  

// 插件翻页

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
  });