/*
*
* 分类控制器
*
*/

const Category = require('../np-model/category.model')

// 获取分类列表
exports.getList = ({ error, success, query }) => {

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    page: Number(query.page || 1),
    limit: Number(query.per_page || 12)
  }

  // 请求
  Category.paginate(query, options, (err, categories) => {
    if(err) return error({ debug: err })
    success({
      pagination: {
        total: categories.total,
        current_page: options.page,
        total_page: categories.pages,
        per_page: options.limit
      },
      data: categories.docs
    })
  })
}

// 发布分类
exports.postItem = ({ body, error, success }) => {

  // 保存分类
  const saveCategory = () => {
    const category = new Category(body)
    category.save((err, data) => {
      err && error({ debug: err })
      err || success(data)
    })
  }

  // 验证Slug合法性
  Category.find({ slug: body.slug }, (err, data) => {
    if (err) return error({ debug: err })
    data.length && error({ message: 'slug已被使用' })
    data.length || saveCategory()
  })
}

// 批量删除分类
exports.delList = ({ body, error, success }) => {
  const categories = body.categories.replace(/\s/g,'').split(',')
  Category.remove({ '_id': { $in: categories } }, (err, data) => {
    err && error({ debug: err })
    err || success(data)
  })
}

// 获取单个分类(以及父子分类)
exports.getItem = ({ params, error, success }) => {
  const category_id = params.category_id
  const categories = []
  const findCateItem = _id => {
    Category.findById(_id, (err, category) => {
      if(err) return error({ debug: err })
      if (!category) return error({ message: '分类不存在' })
      categories.unshift(category)
      const pid = category.pid
      const ok = !!pid && pid != category.id
      ok && findCateItem(pid)
      ok || success(categories)
    })
  }
  findCateItem(category_id)
}

// 修改单个分类
exports.putItem = ({ params, body, error, success }) => {

  const category_id = params.category_id
  const pid = body.pid

  // 修改前判断slug的唯一性，是否被占用
  Category.find({ slug: body.slug }, (err, data) => {
    if (err) return error({ debug: err })

    // 判断查找到的数据是否为自身
    const is_self = (!!data.length && data.length == 1 && data[0]._id == category_id)

    // 存在数据且不是自身
    if (!!data.length && !is_self) return error({ message: 'slug已被使用' })

    // 不存在数据或数据是自身
    if (!data.length || is_self) {

      if (['0', 'null', 'false'].includes(pid) || !pid || Object.is(pid, category_id)) body.pid = null
      Category.findByIdAndUpdate(category_id, body, function(err, category) {
        if (err) return error({ debug: err })
        category.pid = body.pid
        success(category)
      })
    }
  })
}

// 删除单个分类
exports.delItem = ({ params, body, error, success }) => {
  const category_id = params.category_id

  // 删除分类
  Category.findByIdAndRemove(category_id, (err, _category) => {
    if (err) return error({ debug: err })

    // 删除此分类的所有子分类的pid
    Category.find({ pid: category_id }, (err, data) => {
      let cate_ids = []
      data.forEach(cate => { cate_ids.push(cate._id) })
      if (!!cate_ids.length) {
        const category = Category.collection.initializeOrderedBulkOp()
        category.find({ '_id': { $in: cate_ids } }).update({ $set: { pid: _category.pid || null }})
        category.execute((err, data) => {
          if (!err) success(_category)
        })
      } else {
        success(_category)
      }
    })
  })
}
