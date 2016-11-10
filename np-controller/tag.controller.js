/*
*
* 标签控制器模块
*
*/

const Tag = require('../np-model/tag.model')

// 获取标签列表
exports.getList = ({ query, error, success }) => {

  // 保留过滤条件，之后标签过多可能会有标签列表页
  const options = {
    sort: { _id: 1 },
    page: Number(query.page || 1),
    limit: Number(query.per_page || 12)
  }

  // 请求
  Tag.paginate(query, options, (err, tags) => {
    if(err) return error({ debug: err })
    success({
      pagination: {
        total: tags.total,
        current_page: options.page,
        total_page: tags.pages,
        per_page: options.limit
      },
      data: tags.docs
    })
  })
}

// 发布标签
exports.postItem = ({ body, error, success }) => {

  // 保存标签
  const saveTag = () => {
    const tag = new Tag(body)
    tag.save((err, data) => {
      err && error({ debug: err })
      err || success(data)
    })
  }

  // 验证Slug合法性
  Tag.find({ slug: body.slug }, (err, data) => {
    if (err) return error({ debug: err })
    data.length && error({ message: 'slug已被使用' })
    data.length || saveTag()
  })
}

// 批量删除标签
exports.delList = ({ body, error, success }) => {
  const tags = body.tags.replace(/\s/g,'').split(',')
  Tag.remove({ '_id': { $in: tags } }, (err, data) => {
    err && error({ debug: err })
    err || success(data)
  })
}

// 获取单个标签
exports.getItem = ({ params, error, success }) => {
  Tag.findById(params.tag_id, (err, tag) => {
    err && error({ debug: err })
    err || success({ message: '标签不存在' })
  })
}

// 修改单个标签
exports.putItem = ({ params, body, error, success }) => {

  const tag_id = params.tag_id

  // 修改前判断slug的唯一性，是否被占用
  Tag.find({ slug: body.slug }, (err, data) => {
    if (err) return error({ debug: err })

    // 判断查找到的数据是否为自身
    const is_self = (!!data.length && data.length == 1 && data[0]._id == tag_id)

    // 存在数据且不是自身
    if (!!data.length && !is_self) return error({ message: 'slug已被使用' })

    // 不存在数据或数据是自身
    if (!data.length || is_self) {
      Tag.findByIdAndUpdate(tag_id, body, function(err, tag) {
        err && error({ debug: err })
        err || success(tag)
      })
    }
  })
}

// 删除单个标签
exports.delItem = ({ params, body, error, success }) => {
  Tag.findByIdAndRemove(params.tag_id, (err, tag) => {
    err && error({ debug: err })
    err || success(tag)
  })
}
