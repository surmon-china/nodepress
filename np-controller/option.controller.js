/*
*
* 设置控制器模块
*
*/

const Option = require('../np-model/option.model')

// 获取option列表
exports.getList = ({ query, error, success }) => {
  Option.find(query || {}).sort({ '_id': 1 }).exec((err, options) => {
    err && error({ debug: err })
    err || success(options)
  })
}

// 发布option
exports.postItem = ({ body, error, success }) => {

  // 保存option
  const saveOption = () => {
    const option = new Option(body)
    option.save((err, data) => {
      err && error({ debug: err })
      err || success(data)
    })
  }

  // 验证Slug合法性
  Option.find({ slug: body.slug }, (err, data) => {
    if (err) return error({ debug: err })
    data.length && error({ message: 'slug已被使用' })
    data.length || saveOption()
  })
}

// 获取单个option
exports.getItem = ({ params, error, success }) => {
  Option.findById(params.option_id, (err, option) => {
    err && error({ debug: err })
    err || success({ message: 'option不存在' })
  })
}

// 修改单个option
exports.putItem = ({ params, body, error, success }) => {

  const option_id = params.option_id

  // 修改前判断slug的唯一性，是否被占用
  Option.find({ slug: body.slug }, (err, data) => {
    if (err) return error({ debug: err })

    // 判断查找到的数据是否为自身
    const is_self = (!!data.length && data.length == 1 && data[0]._id == option_id)

    // 存在数据且不是自身
    if (!!data.length && !is_self) return error({ message: 'slug已被使用' })

    // 不存在数据或数据是自身
    if (!data.length || is_self) {
      Option.findByIdAndUpdate(option_id, body, function(err, option) {
        err && error({ debug: err })
        err || success(option)
      })
    }
  })
}

// 删除单个option
exports.delItem = ({ params, body, error, success }) => {
  Option.findByIdAndRemove(params.option_id, (err, option) => {
    err && error({ debug: err })
    err || success(option)
  })
}
