/**
 * MusicCtrl module.
 * https://github.com/surmon-china/nodepress/blob/2533fd394a3b11a81e48605b4a667f3e222be38b/np-controller/music.controller.bak.js
 * @file Music 控制器模块
 * @module controller/music
 * @author Surmon <https://github.com/surmon-china>
 */

const redis = require('np-core/np-redis')
const NeteseMusic = require('simple-netease-cloud-music')
const { REDIS_CACHE_FIELDS } = require('np-core/np-constants')
const { numberIsInvalid } = require('np-helper/np-data-validate')
const {
	handleError,
	handleSuccess,
	humanizedHandleError,
	humanizedHandleSuccess,
	buildController,
	initController
} = require('np-core/np-processor')

const neteseMusic = new NeteseMusic()
const musicCtrl = initController(['lrc', 'list', 'song', 'url', 'pic'])

// 默认参数
const defaultListLimit = 30
const defaultListId = '638949385'

// 获取歌单列表
const getMusicList = (list_id, list_limit) => {
	return neteseMusic._playlist(list_id)
		.then(({ playlist }) => {
			Reflect.deleteProperty(playlist, 'trackIds')
			playlist.tracks = playlist.tracks.slice(0, list_limit)
			return playlist
		})
}

// 歌单缓存器
const redisMusicListCache = redis.interval({
	timeout: {
		// 成功后 30分钟 获取数据
		success: 1000 * 60 * 30,
		// 失败后 5分钟 获取数据
		error: 1000 * 60 * 5
	},
	key: REDIS_CACHE_FIELDS.musicList + defaultListId,
	promise: () => getMusicList(defaultListId, defaultListLimit)
})

// 获取某歌单列表
musicCtrl.list.GET = (req, res) => {

	const list_limit = req.query.limit || defaultListLimit
	const list_id = req.params.list_id || defaultListId

	if (numberIsInvalid(list_id)) {
		return handleError({ res, message: '参数无效' })
	}

	// 是否命中缓存请求
	const hitCacheRequest = list_limit == defaultListLimit && list_id == defaultListId
	const musicListRequest = hitCacheRequest
										? redisMusicListCache()
										: getMusicList(list_id, list_limit)
	musicListRequest
		.then(humanizedHandleSuccess(res, '歌单列表获取成功'))
		.catch(humanizedHandleError(res, '歌单列表获取失败'))
}

// 获取歌曲详情
musicCtrl.song.GET = (req, res) => {
	const song_id = req.params.song_id

	if (numberIsInvalid(song_id)) {
		return handleError({ res, message: '参数无效' })
	}
	neteseMusic.song(song_id)
		.then(humanizedHandleSuccess(res, '歌曲详情获取成功'))
		.catch(humanizedHandleError(res, '歌曲详情获取失败'))
}

// 获取歌曲地址
musicCtrl.url.GET = (req, res) => {
	const song_id = req.params.song_id

	if (numberIsInvalid(song_id)) {
		return handleError({ res, message: '参数无效' })
	}
	neteseMusic.url(song_id, 128)
		.then(humanizedHandleSuccess(res, '歌曲地址获取成功'))
		.catch(humanizedHandleError(res, '歌曲地址获取失败'))
}

// 获取歌词
musicCtrl.lrc.GET = (req, res) => {
	const song_id = req.params.song_id

	if (numberIsInvalid(song_id)) {
		return handleError({ res, message: '参数无效' })
	}
	neteseMusic.lyric(song_id)
		.then(humanizedHandleSuccess(res, '歌词获取成功'))
		.catch(humanizedHandleError(res, '歌词获取失败'))
}

// 获取图片封面
musicCtrl.pic.GET = (req, res) => {
	const pic_id = req.params.pic_id

	if (numberIsInvalid(pic_id)) {
		handleError({ res, message: '参数无效' })
	}
	neteseMusic.picture(pic_id, 700)
		.then(humanizedHandleSuccess(res, '封面获取成功'))
		.catch(humanizedHandleError(res, '封面获取失败'))
}

exports.pic = buildController(musicCtrl.pic)
exports.url = buildController(musicCtrl.url)
exports.lrc = buildController(musicCtrl.lrc)
exports.list = buildController(musicCtrl.list)
exports.song = buildController(musicCtrl.song)
