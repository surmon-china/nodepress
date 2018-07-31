/*
*
* Music控制器
*
*/

const NeteseMusic = require('simple-netease-cloud-music');

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');

const neteseMusic = new NeteseMusic();
const musicCtrl = { lrc: {}, list: {}, song: {}, url: {}, pic: {} };

// 获取某歌单列表
musicCtrl.list.GET = (req, res) => {
	const play_list_id = req.params.play_list_id;
	if (!play_list_id || Object.is(Number(play_list_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
	neteseMusic._playlist(play_list_id).then(({ playlist }) => {
		handleSuccess({ res, result: playlist, message: '歌单列表获取成功' });
	});
};

// 获取歌曲详情
musicCtrl.song.GET = (req, res) => {
	const song_id = req.params.song_id;
	if (!song_id || Object.is(Number(song_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
	neteseMusic.song(song_id).then(result => {
		handleSuccess({ res, result, message: '歌曲详情获取成功' });
	});
};

// 获取歌曲地址
musicCtrl.url.GET = (req, res) => {
	const song_id = req.params.song_id;
	if (!song_id || Object.is(Number(song_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
	neteseMusic.url(song_id, 128).then(result => {
		handleSuccess({ res, result, message: '歌曲地址获取成功' });
	});
};

// 获取歌词
musicCtrl.lrc.GET = (req, res) => {
	const song_id = req.params.song_id;
	if (!song_id || Object.is(Number(song_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
	neteseMusic.lyric(song_id).then(result => {
		handleSuccess({ res, result, message: '歌词获取成功' });
	});
};

// 获取图片封面
musicCtrl.pic.GET = (req, res) => {
	const pic_id = req.params.pic_id;
	if (!pic_id || Object.is(Number(pic_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
	neteseMusic.picture(pic_id, 700).then(result => {
		handleSuccess({ res, result, message: '封面获取成功' });
	});
};

exports.pic = (req, res) => { handleRequest({ req, res, controller: musicCtrl.pic })};
exports.url = (req, res) => { handleRequest({ req, res, controller: musicCtrl.url })};
exports.lrc = (req, res) => { handleRequest({ req, res, controller: musicCtrl.lrc })};
exports.list = (req, res) => { handleRequest({ req, res, controller: musicCtrl.list })};
exports.song = (req, res) => { handleRequest({ req, res, controller: musicCtrl.song })};
