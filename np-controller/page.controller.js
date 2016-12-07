/*
*
* 页面 API
*
*/

// 页面控制器、控制器请求器、请求类型识别器
const { ApiMethod, ControllerPromise } = require('../np-common')
const controller = require('../np-controller/tag.controller')

const pageApi = { list: {}, item: {} }

// 获取页面列表
pageApi.list.GET = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'getList',
    success_msg: '页面列表获取成功',
    error_msg: '页面列表获取失败'
  })
}

// 发布页面
pageApi.list.POST = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'postItem',
    success_msg: '页面发布成功',
    error_msg: '页面发布失败'
  })
}

// 批量删除页面
pageApi.list.DELETE = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'delList',
    success_msg: '页面批量删除成功',
    error_msg: '页面批量删除失败'
  })
}

// 获取单个页面
pageApi.item.GET = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'getItem',
    success_msg: '单个页面获取成功',
    error_msg: '单个页面获取失败'
  })
}

// 修改单个页面
pageApi.item.PUT = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'putItem',
    success_msg: '单个页面修改成功',
    error_msg: '单个页面修改失败'
  })
}

// 删除单个页面
pageApi.item.DELETE = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'delItem',
    success_msg: '单个页面删除成功',
    error_msg: '单个页面删除失败'
  })
}

// 模块暴露
exports.list = (req, res) => {
  ApiMethod({ req, res, type: 'list', api: pageApi })
}
exports.item = (req, res) => {
  ApiMethod({ req, res, type: 'item', api: pageApi })
}

