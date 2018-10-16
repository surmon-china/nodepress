/**
 * WallpaperCtrl module.
 * @file 壁纸功能控制器模块
 * @module controller/wallpaper
 * @author Surmon <https://github.com/surmon-china>
 */

const consola = require('consola')
const redis = require('np-core/np-redis')
const WonderfulBingWallpaper = require('wonderful-bing-wallpaper')
const { REDIS_CACHE_FIELDS } = require('np-core/np-constants')
const {
	handleError,
	handleSuccess,
	buildController,
	initController
} = require('np-core/np-processor')

const WallpaperCtrl = initController(['list', 'story'])
const wbw = new WonderfulBingWallpaper({ local: 'zh-CN', host: 'cn.bing.com' })

// 默认请求参数
const WALLPAPER_PARAMS = { size: 8 }

// 几小时
const hours = hours => 1000 * 60 * 60 * hours

// 几小时更新一次数据
const intervalGetPapers = h => setTimeout(getWallpapers, hours(h))

// 获取今日壁纸
const getWallpapers = ({ res = null, params = WALLPAPER_PARAMS, isRedis = true }) => {
  wbw.getWallpapers(params)
    .then(wallpaperJSON => {
			try {
				const result = wbw.humanizeWallpapers(wallpaperJSON)
				isRedis
					? redis.set(REDIS_CACHE_FIELDS.wallpapers, result) && intervalGetPapers(1)
					: handleSuccess({ res, result, message: '今日壁纸获取成功' })
			} catch (err) {
				isRedis
					? intervalGetPapers(0.5)
					: handleError({ res, err, message: '今日壁纸获取失败' })
				consola.warn('wallpaper 控制器解析 JSON 失败', new Date(), wallpaperJSON)
			}
    })
    .catch(err => {
			isRedis
				? intervalGetPapers(0.5)
				: handleError({ res, err, message: '今日壁纸获取失败' })
			consola.warn('getWallpapers 获取多个壁纸出现了问题', new Date(), err)
		})
}

// 初始化自动请求
getWallpapers({})

// 请求响应
WallpaperCtrl.list.GET = (req, res) => {
	const { size, day } = req.query

	// 如果请求的是默认数据则直接返回内存中的
	const defaultDay = day === undefined || day == 0
	const defaultSize = size === undefined || size == 8
	if (defaultDay && defaultSize) {
		redis.get(REDIS_CACHE_FIELDS.wallpapers, (err, result) => {
			handleSuccess({ res, result, message: '今日壁纸获取成功' })
		})

	// 否则重新走正常流程
	} else {
		const params = {}
		day && (params.day = day)
		size && (params.size = size)
		getWallpapers({ res, params, isRedis: false })
	}
}

// 获取今日壁纸故事并缓存
;((function getTodayStory() {
	wbw.getTodayWallpaperStory()
		.then(story => {
			redis.set(REDIS_CACHE_FIELDS.wallpaperStory, story)
			setTimeout(getTodayStory, hours(1))
		})
		.catch(err => {
			consola.warn('今日壁纸故事远程请求失败：', new Date(), err)
			setTimeout(getTodayStory, hours(0.5))
		})
})())

// 获取今日壁纸故事
WallpaperCtrl.story.GET = (req, res) => {
	redis.get(REDIS_CACHE_FIELDS.wallpaperStory, (err, result) => {
		handleSuccess({ res, result, message: '今日壁纸故事获取成功' })
	})
}

exports.list = buildController(WallpaperCtrl.list)
exports.story = buildController(WallpaperCtrl.story)
