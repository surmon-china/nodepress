/**
 * Ip module.
 * @file IP 地址统一查询模块
 * @module utils/ip
 * @author Surmon <https://github.com/surmon-china>
 */

const request = require('request')
const CONFIG = require('app.config')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// 验证权限
const queryIpInfo = ip => {
  return new Promise((resolve, reject) => {
    request({
      headers: { 'Authorization': `APPCODE ${CONFIG.ALIYUN.ip}` },
      url: `https://dm-81.data.aliyun.com/rest/160601/ip/getIpInfo.json?ip=${ip}`
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const result = JSON.parse(body)
        if (result && result.code === 0) {
          resolve(result.data)
        } else {
          reject(result)
        }
      } else {
        reject(error || response.statusMessage)
      }
    })
  })
}

module.exports = queryIpInfo
