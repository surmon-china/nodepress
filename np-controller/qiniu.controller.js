/**
 * QiniuCtrl module.
 * @file 七牛控制器模块
 * @module controller/qiniu
 * @author Surmon <https://github.com/surmon-china>
 */

const qiniu = require('qn')
const CONFIG = require('app.config')
const { buildController, initController, handleSuccess } = require('np-core/np-processor')

const client = qiniu.create(CONFIG.QINIU)
const QiniuCtrl = initController()

// 获取配置列表
QiniuCtrl.GET = (req, res) => {
	const result = { upToken: client.uploadToken() }
  handleSuccess({ res, result, message: 'upToken 获取成功' })
}

module.exports = buildController(QiniuCtrl)
