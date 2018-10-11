/*
*
* 网站地图控制器
*
*/

const buildSiteMap = require('np-utils/np-sitemap')
const { handleRequest, handleError } = require('np-utils/np-handle')

const sitrmapCtrl = {}

// 获取地图
sitrmapCtrl.GET = (req, res) => {
	buildSiteMap(xml => {
		res.header('Content-Type', 'application/xml')
		res.send(xml)
	}, err => {
		handleError({ res, err, message: '获取失败' })
	})
}

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: sitrmapCtrl })}
