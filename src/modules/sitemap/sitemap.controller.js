/**
 * SitrmapCtrl module.
 * @file 网站地图控制器模块
 * @module controller/sitrmap
 * @author Surmon <https://github.com/surmon-china>
 */

const redis = require('np-core/np-redis')
const updateAndBuildSiteMap = require('np-utils/np-sitemap')
const { REDIS_CACHE_FIELDS } = require('np-core/np-constants')
const { buildController, initController, humanizedHandleError } = require('np-core/np-processor')

// controller
const SitrmapCtrl = initController()

// 获取地图
SitrmapCtrl.GET = (req, res) => {
  redis.promise({
    key: REDIS_CACHE_FIELDS.sitemap,
    promise: updateAndBuildSiteMap
  })
  .then(xml => {
    res.header('Content-Type', 'application/xml')
    res.send(xml)
  })
  .catch(humanizedHandleError(res, '获取地图失败'))
}

module.exports = buildController(SitrmapCtrl)
