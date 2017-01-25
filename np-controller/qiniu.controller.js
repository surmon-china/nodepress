/*
*
* 七牛控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('../np-handle')
const CONFIG = require('../np-config')
const qiniu = require('qn')
const client = qiniu.create(CONFIG.QINIU)
let qiniuCtrl = {}

// 获取配置列表
qiniuCtrl.GET = (req, res) => {
  res.jsonp({ uptoken: client.uploadToken() })
}

// 模块暴露
module.exports = (req, res) => { handleRequest({ req, res, controller: qiniuCtrl })}
