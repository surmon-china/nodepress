/**
 * GithubCtrl module.
 * @file Github 控制器模块
 * @module controller/github
 * @author Surmon <https://github.com/surmon-china>
 */

const constants = require('np-core/np-constants')
const { handleSuccess } = require('np-core/np-processor')

const result = Object.assign({}, constants)
Reflect.deleteProperty(result, 'REDIS_CACHE_FIELDS')

// 获取同构常量数据
module.exports = (_, res) => {
  handleSuccess({ res, result, message: '配置常量获取成功' })
}
