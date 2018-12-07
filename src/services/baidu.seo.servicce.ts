/**
 * Auth module.
 * @file badu-seo-push 模块
 * @module utils/badu-seo-push
 * @author Surmon <https://github.com/surmon-china>
 */

const request = require('request')
const consola = require('consola')
const CONFIG = require('app.config')

// POST request
const postRequest = ({ urlKey, urls, msg }) => {
  request.post({
    body: urls,
    headers: { 'Content-Type': 'text/plain' },
    url: `http://data.zz.baidu.com/${urlKey}?site=${CONFIG.BAIDU.site}&token=${CONFIG.BAIDU.token}`
  }, (error, response, body) => {
    consola.info(urls, msg, error, body)
  })
}

// 提交记录
exports.baiduSeoPush = urls => {
  // consola.log('百度推送：', urls)
  postRequest({ urls, urlKey: 'urls', msg: '百度推送结果：' })
}

// 更新记录
exports.baiduSeoUpdate = urls => {
  // consola.log('百度更新：', urls)
  postRequest({ urls, urlKey: 'update', msg: '百度更新结果：' })
}

// 删除记录
exports.baiduSeoDelete = urls => {
  // consola.log('百度删除：', urls)
  postRequest({ urls, urlKey: 'del', msg: '百度删除结果：' })
}
