/**
 * MusicCtrl module.
 * https://github.com/surmon-china/nodepress/blob/2533fd394a3b11a81e48605b4a667f3e222be38b/np-controller/music.controller.bak.js
 * @file Music 控制器模块
 * @module controller/music
 * @author Surmon <https://github.com/surmon-china>
 */

const NeteseMusic = require('simple-netease-cloud-music')
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

// 获取某歌单列表
musicCtrl.list.GET = (req, res) => {

	const limit_num = req.query.limit || 30
	const play_list_id = req.params.play_list_id

	if (numberIsInvalid(play_list_id)) {
		return handleError({ res, message: '参数无效' })
	}

	neteseMusic._playlist(play_list_id)
		.then(({ playlist }) => {
			Reflect.deleteProperty(playlist, 'trackIds')
			playlist.tracks = playlist.tracks.slice(0, limit_num)
			handleSuccess({ res, result: playlist, message: '歌单列表获取成功' })
		})
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
