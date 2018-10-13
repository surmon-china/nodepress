/**
 * WallpaperCtrl module.
 * @file 壁纸功能控制器模块
 * @module controller/wallpaper
 * @author Surmon <https://github.com/surmon-china>
 */

const WonderfulBingWallpaper = require('wonderful-bing-wallpaper')
const {
	handleSuccess,
	humanizedHandleSuccess,
	humanizedHandleError,
	buildController,
	initController
} = require('np-core/np-processor')

const wbw = new WonderfulBingWallpaper({ local: 'zh-CN', host: 'cn.bing.com' })
const WallpaperCtrl = initController(['list', 'story'])

// 获取今日壁纸
WallpaperCtrl.list.GET = (req, res) => {
	const { size, day } = req.query
	const params = {}
	day && (params.day = day)
	size && (params.size = size)
	wbw.getWallpapers(params)
		.then(wallpaperJSON => {
			const result = wbw.humanizeWallpapers(wallpaperJSON)
			handleSuccess({ res, result, message: '今日壁纸获取成功' })
		})
		.catch(humanizedHandleError(res, '今日壁纸获取失败'))
}

// 获取今日壁纸故事
WallpaperCtrl.story.GET = (req, res) => {
	wbw.getTodayWallpaperStory()
		.then(humanizedHandleSuccess(res, '今日壁纸故事获取成功'))
		.catch(humanizedHandleError(res, '今日壁纸故事获取失败'))
}

exports.list = buildController(WallpaperCtrl.list)
exports.story = buildController(WallpaperCtrl.story)
