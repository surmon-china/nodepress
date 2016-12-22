/*
*
* 标签控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle')
const Tag = require('../np-model/tag.model')
let tagCtrl = {list: {}, item: {}}

// 获取标签列表
tagCtrl.list.GET = ({ query: { tag = 1, per_tag = 12 }}, res) => {

  // 过滤条件
  const options = {
    sort: { _id: 1 },
    tag: Number(tag),
    limit: Number(per_tag)
  }

  // 请求
  Tag.paginate({}, options, (err, tags) => {
    if(err) return handleError({ res, err, message: '标签列表获取失败' })
    handleSuccess({
      res,
      message: '标签列表获取成功',
      result: {
        pagination: {
          total: tags.total,
          current_tag: options.tag,
          total_tag: tags.tags,
          per_tag: options.limit
        },
        data: tags.docs
      }
    })
  })
}

// 发布标签
tagCtrl.list.POST = ({ body }, res) => {

  // 验证
  if (body.slug == undefined)
    return handleError({ res, message: '缺少slug' })

  // 保存标签
  const saveTag = () => {
    new Tag(body).save((err, result) => {
      err && handleError({ res, err, message: '标签发布失败' })
      err || handleSuccess({ res, result, message: '标签发布成功' })
    })
  }

  // 验证Slug合法性
  Tag.find({ slug: body.slug }, (err, tags) => {
    if (err) return handleError({ res, err, message: '标签发布失败' })
    tags.length && handleError({ res, message: 'slug已被占用' })
    tags.length || saveTag()
  })
}

// 批量删除标签
tagCtrl.list.DELETE = ({ body: { tags }}, res) => {

  // 验证
  if (!tags || !tags.length)
    return handleError({ res, message: '缺少有效参数' })

  Tag.remove({ '_id': { $in: tags } }, (err, result) => {
    err && handleError({ res, err, message: '标签批量删除失败' })
    err || handleSuccess({ res, result, message: '标签批量删除成功' })
  })
}

// 获取单个标签
tagCtrl.item.GET = ({ params: { tag_id } }, res) => {
  Tag.findById(tag_id, (err, tag) => {
    if(err || !tag) return handleError({ res, err, message: err ? '标签获取失败' : '标签不存在' })
    handleSuccess({ res, result: tags, message: '标签获取成功' })
  })
}

// 修改单个标签
tagCtrl.item.PUT = ({ params: { tag_id }, body, body: { slug }}, res) => {

  if (!slug) return handleError({ res, message: 'slug不合法' })

  // 修改
  const putTag = () => {
    Tag.findByIdAndUpdate(tag_id, body, (err, tag) => {
      err && handleError({ res, err, message: '标签修改失败' })
      err || handleSuccess({ res, result: tag, message: '标签修改成功' })
    })
  }

  // 修改前判断slug的唯一性，是否被占用
  Tag.find({ slug }, (err, tags) => {
    if (err) return handleError({ res, err, message: '标签修改失败' })
    const canPut = (!tags.length || (!!tags.length && Object.is(tags.length, 1) && tags[0]._id == tag_id))
    canPut ? putTag() : handleError({ res, err, message: '修改失败，slug已被使用' })
  })
}

// 删除单个标签
tagCtrl.item.DELETE = ({ params: { tag_id }}, res) => {
  Tag.findByIdAndRemove(tag_id, (err, result) => {
    if (err) return handleError({ res, err, message: '标签删除失败' })
    handleSuccess({ res, result, message: '标签删除成功' })
  })
}

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: tagCtrl.list })}
exports.item = (req, res) => { handleRequest({ req, res, controller: tagCtrl.item })}
