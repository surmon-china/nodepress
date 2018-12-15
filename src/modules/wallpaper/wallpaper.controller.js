/**
 * WallpaperCtrl module.
 * @file 壁纸功能控制器模块
 * @module controller/wallpaper
 * @author Surmon <https://github.com/surmon-china>
 */

const console = require('console')
const redis = require('np-core/np-redis')
const WonderfulBingWallpaper = require('wonderful-bing-wallpaper')
const { REDIS_CACHE_FIELDS } = require('np-core/np-constants')
const {
  handleError,
  handleSuccess,
  humanizedHandleError,
  humanizedHandleSuccess,
  buildController,
  initController
} = require('np-core/np-processor')

const WallpaperCtrl = initController(['list', 'story'])
const wbw = new WonderfulBingWallpaper({ local: 'zh-CN', host: 'cn.bing.com' })

// 通用定时配置
const commonTimingConfig = {
  // 默认每天的 0:00:10 获取数据
  schedule: '10 0 0 * * *',
  // 如果获取失败则一分钟后重新获取一次
  error: 1000 * 60
}

// 获取今日壁纸
const getWallpapers = params => {
  return new Promise((resolve, reject) => {
    wbw.getWallpapers(params)
      .then(wallpaperJSON => {
        try {
          const wallpapers = wbw.humanizeWallpapers(wallpaperJSON)
          return resolve(wallpapers)
        } catch (err) {
          console.warn('wallpaper 控制器解析 JSON 失败', wallpaperJSON)
          return reject(err)
        }
      })
      .catch(err => {
        console.warn('getWallpapers 获取多个壁纸出现了问题', err)
        return reject(err)
      })
  })
}

// 获取今日壁纸故事 Redis 任务
const redisWallpapersCache = redis.interval({
  key: REDIS_CACHE_FIELDS.wallpapers,
  timing: commonTimingConfig,
  promise: () => getWallpapers({ size: 8 })
})

// 请求响应
WallpaperCtrl.list.GET = (req, res) => {

  const { size, day } = req.query

  // 如果请求的是默认数据则直接返回内存中的
  const isDefaultDay = day === undefined || day == 0
  const isDefaultSize = size === undefined || size == 8

  // 正常任务
  const normalTask = () => {
    const params = {}
    day && (params.day = day)
    size && (params.size = size)
    return getWallpapers(params)
  }

  // 缓存任务
  const cacheTask = () => redisWallpapersCache()

  // 命中缓存请求
  const hitCacheRequest = isDefaultDay && isDefaultSize
  const wallpapersRequest = hitCacheRequest ? cacheTask() : normalTask()
  
  wallpapersRequest
    .then(humanizedHandleSuccess(res, '今日壁纸获取成功'))
    .catch(humanizedHandleError(res, '今日壁纸获取失败'))
}

// 获取今日壁纸故事 Redis 任务
const redisStoryCache = redis.interval({
  key: REDIS_CACHE_FIELDS.wallpaperStory,
  timing: commonTimingConfig,
  promise: () => wbw.getTodayWallpaperStory() 
})

// 获取今日壁纸故事
WallpaperCtrl.story.GET = (req, res) => {
  redisStoryCache()
    .then(humanizedHandleSuccess(res, '今日壁纸故事获取成功'))
    .catch(humanizedHandleError(res, '今日壁纸故事获取失败'))
}

exports.list = buildController(WallpaperCtrl.list)
exports.story = buildController(WallpaperCtrl.story)
