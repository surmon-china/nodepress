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
exports.postItem = params => {
  let error    = params.error
  let success  = params.success
  let category = params.body

  // 保存分类
  let saveCategory = () => {
    let _category = new Category(category)
    _category.save((err, data) => {
      err && error({ debug: err })
      err || success(data)
    })
  }

  // 验证Slug合法性
  Category.find({ slug: category.slug }, (err, data) => {
    if (err) return error({ debug: err })
    data.length && error({ message: 'slug已被使用' })
    data.length || saveCategory()
  })
}

// 批量删除分类
exports.delList = params => {
  let error    = params.error
  let success  = params.success
  let categories = params.body.categories.replace(/\s/g,'').split(',')
  Category.remove({ '_id': { $in: categories } }, (err, data) => {
    err && error({ debug: err })
    err || success(data)
  })
}

// 获取单个分类(以及父子分类)
exports.getItem = params => {
  let error   = params.error
  let success = params.success
  let cate_id = params.params.category_id
  let categories = []
  var findCateItem = _id => {
    Category.findById(_id, (err, category) => {
      if(err) return error({ debug: err })
      if (!category) return error({ message: '分类不存在' })
      categories.unshift(category)
      let pid = category.pid
      let ok = !!pid && pid != category.id
      ok && findCateItem(pid)
      ok || success(categories)
    })
  }
  findCateItem(cate_id)
}

// 修改单个分类
exports.putItem = params => {
  let error   = params.error
  let success = params.success
  let content = params.body || {}
  let cate_id = params.params.category_id

  // 修改前判断slug的唯一性，是否被占用
  Category.find({ slug: content.slug }, (err, data) => {
    if (err) return error({ debug: err })

    // 判断查找到的数据是否为自身
    let is_self = (!!data.length && data.length == 1 && data[0]._id == cate_id)

    // 存在数据且不是自身
    if (!!data.length && !is_self) return error({ message: 'slug已被使用' })

    // 不存在数据或数据是自身
    if (!data.length || is_self) {

      // 未占用，则修改
      let cate_pid = content.pid
      if (cate_pid == '0' || cate_pid == 'null' || cate_pid == 'false' || !cate_pid || cate_pid == cate_id) cate_pid = null
      content.pid = cate_pid
      Category.findByIdAndUpdate(cate_id, content, function(err, category) {
        if (err) return error({ debug: err })
        if (!err) {
          category.pid = content.pid
          success(category)
        }
      })
    }
  })
}

// 删除单个分类
exports.delItem = params => {
  let error   = params.error
  let success = params.success
  let cate_id = params.params.category_id

  // 删除分类
  Category.findByIdAndRemove(cate_id, (err, _category) => {
    if (err) return error({ debug: err })

    // 删除此分类的所有子分类的pid
    Category.find({ pid: cate_id }, (err, data) => {
      let cate_ids = []
      data.forEach(cate => { cate_ids.push(cate._id) })
      if (!!cate_ids.length) {
        let category = Category.collection.initializeOrderedBulkOp()
        category.find({ '_id': { $in: cate_ids } }).update({ $set: { pid: _category.pid || null }})
        category.execute(function (err, data) {
          // console.log(err, data)
          if (!err) success(_category)
        })
      } else {
        success(_category)
      }
    })
  })
}
