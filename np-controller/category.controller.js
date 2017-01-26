/*
*
* 分类控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle');
const Category = require('../np-model/category.model');
const categoryCtrl = { list: {}, item: {} };

// 分类优化
const categoryOptimize = () => {
  // 找到父分类Pid已失效的分类，将他们的pid改为null
  console.log('优化分类');
};

// 获取分类列表
categoryCtrl.list.GET = ({ query: { page = 1, per_page = 10 }}, res) => {

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    page: Number(page),
    limit: Number(per_page)
  };

  // 请求
  Category.paginate({}, options, (err, categories) => {
    if (err) {
      return handleError({ res, err, message: '分类列表获取失败' });
    }
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
    })
  })
};

// 发布分类
categoryCtrl.list.POST = ({ body }, res) => {

  // 验证
  if (!body.pid) {
    delete body.pid;
  }

  if (body.slug == undefined) {
    return handleError({ res, message: '缺少slug' });
  }

  // 保存分类
  const saveCategory = () => {
    new Category(body).save((err, result) => {
      err && handleError({ res, err, message: '分类发布失败' });
      err || handleSuccess({ res, result, message: '分类发布成功' });
    })
  };

  // 验证Slug合法性
  Category.find({ slug: body.slug }, (err, categories) => {
    if (err) handleError({ res, err, message: '分类发布失败' });
    categories.length && handleError({ res, message: 'slug已被占用' });
    categories.length || saveCategory();
  })
};

// 批量删除分类
categoryCtrl.list.DELETE = ({ body: { categories }}, res) => {

  // 验证
  if (!categories || !categories.length) {
    return handleError({ res, message: '缺少有效参数' });
  }

  Category.remove({ '_id': { $in: categories } }, (err, result) => {
    // 把所有pid为categories中任何一个id的分类分别提升到自己分类本身的PID分类或者null
    err && handleError({ res, err, message: '分类批量删除失败' });
    err || handleSuccess({ res, result, message: '分类批量删除成功' });
  })
}

// 获取单个分类以及所有有关的分类
categoryCtrl.item.GET = ({ params: { category_id } }, res) => {
  let categories = [];
  const findCateItem = _id => {
    Category.findById(_id, (err, category) => {
      if (err) return handleError({ res, err, message: '分类获取失败' });
      if (!category) {
        if (categories.length) handleSuccess({ res, result: categories, message: '分类获取成功' });
        if (!categories.length) handleError({ res, err, message: '分类不存在' });
        return false;
      }
      categories.unshift(category);
      const pid = category.pid;
      const ok = !!pid && pid !== category.id;
      ok ? findCateItem(pid) : handleSuccess({ res, result: categories, message: '分类获取成功' });
    })
  }
  findCateItem(category_id);
}

// 修改单个分类
categoryCtrl.item.PUT = ({ params: { category_id }, body, body: { pid, slug }}, res) => {

  if (slug == undefined) {
    return handleError({ res, message: 'slug不合法' });
  }

  // 修改
  const putCategory = () => {
    if (['', '0', 'null', 'false'].includes(pid) || !pid || Object.is(pid, category_id)) body.pid = null;
    Category.findByIdAndUpdate(category_id, body, (err, category) => {
      err && handleError({ res, err, message: '分类修改失败' });
      err || handleSuccess({ res, result: category, message: '分类修改成功' });
    })
  }

  // 修改前判断slug的唯一性，是否被占用
  Category.find({ slug }, (err, categories) => {
    if (err) return handleError({ res, err, message: '分类修改失败' });
    const canPut = (!categories.length || (!!categories.length && Object.is(categories.length, 1) && categories[0]._id == category_id));
    canPut ? putCategory() : handleError({ res, err, message: '修改失败，slug已被使用' });
  })
}

// 删除单个分类
categoryCtrl.item.DELETE = ({ params: { category_id }}, res) => {

  // delete category
  const deleteCategory = () => {
    return new Promise((resolve, reject) => {
      Category.findByIdAndRemove(category_id, (err, category) => {
        err ? reject({ err }) : resolve(category);
      })
    })
  };

  // delete pid
  const deletePid = category => {
    return new Promise((resolve, reject) => {
      Category.find({ pid: category_id }, (err, categories) => {
        if (!categories.length) return resolve({ result: category });
        let _category = Category.collection.initializeOrderedBulkOp();
        _category.find({ '_id': { $in: Array.from(categories, c => c._id) } }).update({ $set: { pid: category.pid || null }});
        _category.execute((err, data) => {
          err ? reject({ err }) : resolve({ result: category });
        })
      })
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
