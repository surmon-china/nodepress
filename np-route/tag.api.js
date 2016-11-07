/*
*
* 标签 API
*
*/

// 标签控制器、控制器请求器、请求类型识别器
const { ApiMethod, ControllerPromise } = require('../np-common')
const controller = require('../np-controller/tag.controller')

const tagApi = { list: {}, item: {} }

// 获取标签列表
tagApi.list.GET = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'getList',
    success_msg: '标签列表获取成功',
    error_msg: '标签列表获取失败'
  })
}

// 发布标签
tagApi.list.POST = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'postItem',
    success_msg: '标签发布成功',
    error_msg: '标签发布失败'
  })
}

// 批量删除标签
tagApi.list.DELETE = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'delList',
    success_msg: '标签批量删除成功',
    error_msg: '标签批量删除失败'
  })
}

// 获取单个标签以及所有有关的标签
tagApi.item.GET = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'getItem',
    success_msg: '单个标签获取成功',
    error_msg: '单个标签获取失败'
  })
}

// 修改单个标签
tagApi.item.PUT = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'putItem',
    success_msg: '单个标签修改成功',
    error_msg: '单个标签修改失败'
  })
}

// 删除单个标签
tagApi.item.DELETE = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'delItem',
    success_msg: '单个标签删除成功',
    error_msg: '单个标签删除失败'
  })
}

// 模块暴露
exports.list = (req, res) => {
  ApiMethod({ req, res, type: 'list', api: tagApi })
}
exports.item = (req, res) => {
  ApiMethod({ req, res, type: 'item', api: tagApi })
}

