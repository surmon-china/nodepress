/*
*
* Music控制器
*
*/

const request = require('request');
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const musicCtrl = { lrc: {}, list: {}, song: {}};

let playerList = {};
let playerListFetching = false;

const getMusicPlayerList = list_id => {
	playerListFetching = true;
	request.get({
		url: `https://music.163.com/api/playlist/detail?id=${list_id || '638949385'}`
	}, (err, response, body) => {
		if(!err && response.statusCode == 200) {
			const musicResBody = JSON.parse(body);
			if (musicResBody.code == 200) {
				playerList = musicResBody.result;
			}
		}
		playerListFetching = false;
	})
};

getMusicPlayerList();

// 获取歌词
musicCtrl.lrc.GET = (req, res) => {
	const song_id = req.params.song_id;
	if (!song_id || Object.is(Number(song_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
	request.get({
		url: `https://music.163.com/api/song/lyric?lv=-1&id=${song_id}`
	}, (err, response, body) => {
		if(!err && response.statusCode == 200) {
			const musicResBody = JSON.parse(body);
			if (musicResBody.code == 200) {
				handleSuccess({ res, result: musicResBody, message: '歌词详情获取成功' });
			} else {
				handleError({ res, err: musicResBody, message: '请求失败' });
			}
		} else {
			handleError({ res, err, message: '请求失败' });
		}
	});
};

// 获取某歌单列表
musicCtrl.list.GET = (req, res) => {
	const list_id = req.params.play_list_id;
	if (!list_id || Object.is(Number(list_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
	handleSuccess({ res, result: playerList, message: '歌曲列表获取成功' });
	if (!playerListFetching) {
		getMusicPlayerList(list_id);
	};
};

// 获取歌曲详情
musicCtrl.song.GET = (req, res) => {
	const song_id = req.params.song_id;
	if (!song_id || Object.is(Number(song_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
	request.get({
		url: `https://music.163.com/api/song/detail?ids=[${song_id}]`
	}, (err, response, body) => {
		if(!err && response.statusCode == 200) {
			const musicResBody = JSON.parse(body);
			if (musicResBody.code == 200 && musicResBody.songs.length) {
				handleSuccess({ res, result: musicResBody.songs, message: '歌曲详情获取成功' });
			} else {
				handleError({ res, err: musicResBody, message: '请求失败' });
			}
		} else {
			handleError({ res, err, message: '请求失败' });
		}
	});
};

exports.lrc = (req, res) => { handleRequest({ req, res, controller: musicCtrl.lrc })};
exports.list = (req, res) => { handleRequest({ req, res, controller: musicCtrl.list })};
exports.song = (req, res) => { handleRequest({ req, res, controller: musicCtrl.song })};
