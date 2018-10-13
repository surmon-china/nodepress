/**
 * SitrmapCtrl module.
 * @file 网站地图控制器模块
 * @module controller/sitrmap
 * @author Surmon <https://github.com/surmon-china>
 */

const buildSiteMap = require('np-utils/np-sitemap')
const { buildController, initController, humanizedHandleError } = require('np-core/np-processor')

// Controller
const SitrmapCtrl = initController()

// 获取地图
SitrmapCtrl.GET = (req, res) => {
	buildSiteMap().then(xml => {
		res.header('Content-Type', 'application/xml')
		res.send(xml)
	}).catch(humanizedHandleError(res, '获取地图失败'))
}

module.exports = buildController(SitrmapCtrl)
