/**
 * MusicCtrl module.
 * @file Music 控制器模块
 * @module controller/music
 * @author Surmon <https://github.com/surmon-china>
 */

const redis = require('np-core/np-redis')
const NeteseMusic = require('simple-netease-cloud-music')
const { REDIS_CACHE_FIELDS } = require('np-core/np-constants')
const { numberIsInvalid } = require('np-helper/np-data-validate')



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
