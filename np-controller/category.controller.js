/*
*
* 分类控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle');
const Category = require('../np-model/category.model');
const categoryCtrl = { list: {}, item: {} };

// 获取分类列表
categoryCtrl.list.GET = ({ query: { page = 1, per_page = 10 }}, res) => {

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    page: Number(page),
    limit: Number(per_page)
  };

  // 请求
  Category.paginate({}, options)
  .then(categories => {
    handleSuccess({
      res,
      message: '分类列表获取成功',
      result: {
        pagination: {
          total: categories.total,
          current_page: options.page,
          total_page: categories.pages,
          per_page: options.limit
        },
        data: categories.docs
      }
    });
  })
  .catch(err => {
    handleError({ res, err, message: '分类列表获取失败' });
  })
};

// 发布分类
categoryCtrl.list.POST = ({ body: category, body: { slug } }, res) => {

  // 验证
  if (!category.pid) {
    delete category.pid;
  };

  if (category.slug == undefined) {
    handleError({ res, message: '缺少slug' });
    return false;
  };

  // 保存分类
  const saveCategory = () => {
    new Category(category).save()
    .then(result => {
      handleSuccess({ res, result, message: '分类发布成功' });
    })
    .catch(err => {
      handleError({ res, err, message: '分类发布失败' });
    })
  };

  // 验证Slug合法性
  Category.find({ slug })
  .then(categories => {
    categories.length && handleError({ res, message: 'slug已被占用' });
    categories.length || saveCategory();
  })
  .catch(err => {
    handleError({ res, err, message: '分类发布失败' });
  })
};

// 批量删除分类
categoryCtrl.list.DELETE = ({ body: { categories }}, res) => {

  // 验证
  if (!categories || !categories.length) {
    handleError({ res, message: '缺少有效参数' });
    return false;
  };

  // 把所有pid为categories中任何一个id的分类分别提升到自己分类本身的PID分类或者null
  Category.remove({ '_id': { $in: categories }})
  .then(result => {
    handleSuccess({ res, result, message: '分类批量删除成功' });
  })
  .catch(err => {
    handleError({ res, err, message: '分类批量删除失败' });
  })
};

// 获取单个分类以及自身的父分类
categoryCtrl.item.GET = ({ params: { category_id } }, res) => {
  let categories = [];
  const findCateItem = _id => {
    Category.findById(_id)
    .then(category => {
      if (!category) {
        if (!categories.length) handleError({ res, err, message: '分类不存在' });
        if (categories.length) handleSuccess({ res, result: categories, message: '分类获取成功' });
        return false;
      }
      categories.unshift(category);
      const pid = category.pid;
      const hasParent = !!pid && pid !== category.id;
      hasParent ? findCateItem(pid) : handleSuccess({ res, result: categories, message: '分类获取成功' });
    })
    .catch(err => {
      handleError({ res, err, message: '分类获取失败' });
    })
  };
  findCateItem(category_id);
};

// 修改单个分类
categoryCtrl.item.PUT = ({ params: { category_id }, body: category, body: { pid, slug }}, res) => {

  if (slug == undefined) {
    handleError({ res, message: 'slug不合法' });
    return false;
  };

  // 修改
  const putCategory = () => {
    if (['', '0', 'null', 'false'].includes(pid) || !pid || Object.is(pid, category_id)) {
      category.pid = null;
    };
    Category.findByIdAndUpdate(category_id, category, { new: true })
    .then(result => {
      handleSuccess({ res, result, message: '分类修改成功' });
    })
    .catch(err => {
      handleError({ res, err, message: '分类修改失败' });
    })
  };

  // 修改前判断slug的唯一性，是否被占用
  Category.find({ slug })
  .then(([_category]) => {
    const hasExisted = (_category && (_category._id != category_id));
    hasExisted ? handleError({ res, message: 'slug已存在' }) : putCategory(); 
  })
  .catch(err => {
    handleError({ res, err, message: '分类修改失败' });
  })
};

// 删除单个分类
categoryCtrl.item.DELETE = ({ params: { category_id }}, res) => {

  // delete category
  const deleteCategory = () => {
    return Category.findByIdAndRemove(category_id);
  };

  // delete pid
  const deletePid = category => {
    return new Promise((resolve, reject) => {
      Category.find({ pid: category_id })
      .then(categories => {
        // 如果没有子分类
        if (!categories.length) {
          resolve({ result: category });
          return false;
        };
        // 否则更改父分类的子分类
        let _category = Category.collection.initializeOrderedBulkOp();
        _category.find({ '_id': { $in: Array.from(categories, c => c._id) } }).update({ $set: { pid: category.pid || null }});
        _category.execute((err, data) => {
          err ? reject({ err }) : resolve({ result: category });
        })
      })
      .catch(err => reject({ err }))
    })
  };

  (async () => {
    let category = await deleteCategory();
    return await deletePid(category);
  })()
  .then(({ result }) => handleSuccess({ res, result, message: '分类删除成功' }))
  .catch(({ err }) => handleError({ res, err, message: '分类删除失败' }));
};

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: categoryCtrl.list })};
exports.item = (req, res) => { handleRequest({ req, res, controller: categoryCtrl.item })};
