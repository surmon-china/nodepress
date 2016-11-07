/*
*
* 标签API
*
*/

// 引用标签控制器处理
var tagCtrl = require('../np-controller/tag.controller')
var tagApi
tagApi = {}
tagApi.list = {}
tagApi.item = {}

// 类型识别
tagApi.method = (req, res, type) => {
  let method = req.method
  let support = !!tagApi[type] && !!tagApi[type][method]
  if (support) tagApi[type][method](req, res)
  if (!support) res.jsonp({ code: 0, message: '请求不支持！' })
}

// 获取标签列表
tagApi.list.GET = (req, res) => {
  tagCtrl.getList({
    query: req.query,
    success: data => {
      res.jsonp({
        code: 1,
        message: '标签列表获取成功',
        result: data
      })
    },
    error: err => {
      res.jsonp({ code: 0, message: err.message || '标签列表获取失败' })
    }
  })
}

// 发布标签
tagApi.list.POST = (req, res) => {
  tagCtrl.postItem({
    body: req.body,
    success: data => {
      res.jsonp({
        code: 1,
        message: data.message || '标签发布成功',
        result: data
      })
    },
    error: err => {
      res.jsonp({ code: 0, message: err.message || '标签发布失败', debug: err.debug || null })
    }
  })
}

// 批量更新标签
tagApi.list.PUT = (req, res) => {
  res.jsonp({ code: 1, message: '标签批量更新成功' })
}

// 批量删除标签
tagApi.list.DELETE = (req, res) => {
  res.jsonp({ code: 1, message: '标签批量删除成功' })
}

// 获取单个标签
tagApi.item.GET = (req, res) => {
  res.jsonp({ code: 1, message: '单篇标签获取成功' })
}

// 修改单个标签
tagApi.item.PUT = (req, res) => {
  res.jsonp({ code: 1, message: '单篇标签修改成功' })
}

// 删除单个标签
tagApi.item.DELETE = (req, res) => {
  res.jsonp({ code: 1, message: '单篇标签删除成功' })
}

// 模块暴露
exports.list = (req, res) => { tagApi.method(req, res, 'list') }
exports.item = (req, res) => { tagApi.method(req, res, 'item') }
