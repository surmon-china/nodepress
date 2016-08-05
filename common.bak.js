

// 原生翻页示例
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


  name:String,
binary:Buffer,
living:Boolean,
updated:Date,
age:Number,
mixed:Schema.Types.Mixed, //该混合类型等同于nested
_id:Schema.Types.ObjectId,  //主键
_fk:Schema.Types.ObjectId,  //外键
array:[],
arrOfString:[String],
arrOfNumber:[Number],
arrOfDate:[Date],
arrOfBuffer:[Buffer],
arrOfBoolean:[Boolean],
arrOfMixed:[Schema.Types.Mixed],
arrOfObjectId:[Schema.Types.ObjectId]
nested:{
      stuff:String,
}



/*

// 发布分类
exports.postItem = params => {
  let category = params.body;
  commonModelPromise({
    model: Category,
    method: 'find',
    params: { slug: category.slug },
    error: params.error,
    success: data => {
      if (!!data.length) params.error({ message: 'slug已被使用!' });
      if (!data.length) {
        commonModelPromise({
          model: new Category(category),
          method: 'save',
          error: error,
          success: params.success,
        });
      };
    },
  });
};

// 批量删除分类
exports.delList = params => {
  let categories = params.body.categories.replace(/\s/g,'').split(',');
  commonModelPromise({ 
    model: Category,
    method: 'remove',
    params: { '_id': { $in: categories } },
    error: params.error,
    success: params.success,
  });
};

*/

// Promise示例

// 获取文章分类
  let getCategories = category_id => {
    return new Promise((resolve, reject) => {
      categoryCtrl.getItem({
        params: { category_id: category_id },
        success: category => { resolve(category) },
        error: error => { reject(error) }
      });
    });
  };

  // 根据唯一别名获取文章
  let getArticleBySlug = slug => {
    return new Promise((resolve, reject) => {
      Article.findOne({ slug: slug }, (err, article) => {
        err && reject(err);
        err || resolve(article);
      });
    });
  };

  // 根据自增ID获取文章
  let getArticleById = id => {
    return new Promise((resolve, reject) => {
      Category.findOne({ id: id }, (err, article) => {
        err && reject(err);
        err || resolve(article);
      });
    });
  };

  // 文章获取成功
  getArticleBySlug(slug).then(article => {

    _article = article;
    let categories = article ? article.category : [];
    if (!article) error({ message: '文章不存在' });
    if (article && !categories.length) success(article);
    if (article && !!categories.length) return getCategories(article.category);

  // 文章获取失败
  }).catch(err => {

    error({ debug: err });

  // 分类完善成功
  }).then(category => {

    _article.category = category;
    success(_article);

  // 分类完善失败
  }).catch(err => {

    success(_article);
  });