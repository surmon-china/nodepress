/*
*
* 设置API
*
*/

// 配置控制器、控制器请求器、请求类型识别器
const { ApiMethod, ControllerPromise } = require('../np-common')
const controller = require('../np-controller/option.controller')

let optionApi = { list: {}, item: {} }

// 获取配置列表
optionApi.list.GET = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'getList',
    success_msg: '配置列表获取成功',
    error_msg: '配置列表获取失败'
  })
}

// 发布配置
optionApi.list.POST = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'postItem',
    success_msg: '配置发布成功',
    error_msg: '配置发布失败'
  })
}

// 批量删除配置
optionApi.list.DELETE = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'delList',
    success_msg: '配置批量删除成功',
    error_msg: '配置批量删除失败'
  })
}

// 获取单个配置
optionApi.item.GET = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'getItem',
    success_msg: '单个配置获取成功',
    error_msg: '单个配置获取失败'
  })
}

// 修改单个配置
optionApi.item.PUT = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'putItem',
    success_msg: '单个配置修改成功',
    error_msg: '单个配置修改失败'
  })
}

// 删除单个配置
optionApi.item.DELETE = (req, res) => {
  ControllerPromise({
    req, res, controller,
    method: 'delItem',
    success_msg: '单个配置删除成功',
    error_msg: '单个配置删除失败'
  })
}

// 模块暴露
exports.list = (req, res) => {
  ApiMethod({ req, res, type: 'list', api: optionApi })
}
exports.item = (req, res) => {
  ApiMethod({ req, res, type: 'item', api: optionApi })
}

