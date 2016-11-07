/*
*
* 全局设置API
*
*/

// 依赖配置控制器
var optionCtrl = require('../np-controller/option.controller')
var optionApi  = {}

// 获取配置数据
optionApi.GET = (req, res) => {
  optionCtrl.get({
    query: req.query,
    success: data => {
      res.jsonp({
        code: 1,
        message: '全局设置获取成功',
        result: data
      })
    },
    error: err => {
      res.jsonp({ code: 0, message: '全局设置获取失败' })
    }
  })
}

// 修改配置数据
optionApi.PUT = (req, res) => {
  res.jsonp({ code: 1, message: '全局配置更新成功' })
}

// 类型识别
optionApi.method = (req, res) => {
  let method = req.method
  let support = !!optionApi[method]
  if (support) optionApi[method](req, res)
  if (!support) res.jsonp({ code: 0, message: '请求不支持！' })
}

// 模块暴露
module.exports = optionApi.method
