/*
*
* Music控制器
*
*/

const crypto = require('crypto');
const redis = require('np-redis');
const request = require('request');
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const { createWebAPIRequest } = require('NeteaseCloudMusicApi/util/util');
const musicCtrl = { lrc: {}, list: {}, song: {}, url: {}};


// 自动登录
/*
let musicCookie = null;
const loginMusic = () => {
  console.log('登录');
  const md5sum = crypto.createHash('md5')
  md5sum.update('000000')
  const data = {
    'phone': '1231212123123',
    'password': md5sum.digest('hex'),
    'rememberLogin': 'true'
  }

  createWebAPIRequest(
    'music.163.com',
    '/weapi/login/cellphone',
    'POST',
    data,
    '',
    (music_req, cookie) => {
      console.log(music_req, 'cookie', cookie)
      if (cookie) {
        musicCookie = cookie.join()
      }
      // res.set({
      //   'Set-Cookie': cookie,
      // })
      // res.send(music_req)
    },
    err => {
      console.log('err', err)
    }
  )
}
*/

// 获取歌曲详情
const fetchMusicSongDetail = (song_id, success_cb, err_cb) => {
  createWebAPIRequest(
    'music.163.com', '/weapi/song/enhance/player/url', 'POST',
    {
      "ids": [song_id],
      "br": 999000,
      "csrf_token": ""
    },
    musicCookie, success_cb, err_cb
  )
}

// 自动缓存所有歌曲详情（递归歌曲列表，redis => request => 如果全部为true则停止）
const cacheSongDetail = () => {

  // 获取已缓存的所有列表
  redis.get('musicPlayerList', (err, musicPlayerList) => {

    // 拿到所有没有详情的单曲
    const song_list = musicPlayerList.tracks.filter(i => !i.detail);
    // console.log('正在缓存音乐，还剩', song_list.length);
    if (!song_list.length) {
      console.log('Redis音乐全部缓存完毕！');
      return false;
    }

    // 更新列表的方法
    const updateMusicListCache = (song, song_detail, musicPlayerList) => {
      const findSong = musicPlayerList.tracks.find(s => s.id === song.id);
      if (findSong) {
        findSong.detail = song_detail;
        redis.set('musicPlayerList', musicPlayerList);
      }
    }

    // 一首一首开始
    const current_song = song_list[0];
    redis.get(`musicSongDetail-${current_song.id}`, (err, song_detail) => {
      if (err || !song_detail) {
        // console.log('网络请求缓存');
        fetchMusicSongDetail(current_song.id, music_req => {
          music_req = JSON.parse(music_req).data[0];
          redis.set(`musicSongDetail-${current_song.id}`, music_req);
          updateMusicListCache(current_song, music_req, musicPlayerList);
          setTimeout(cacheSongDetail, 1666);
        }, err => {
          console.log('缓存单曲时网络发生错误！');
        })
      } else {
        // console.log('redis请求缓存');
        updateMusicListCache(current_song, song_detail, musicPlayerList);
        setTimeout(cacheSongDetail, 1666);
      }
    })
  })
}

// 获取歌单列表
const fetchMusicPlayerList = (list_id = '638949385') => {
  // console.log('请求音乐url中');
  createWebAPIRequest(
    'music.163.com', '/weapi/v3/playlist/detail', 'POST',
    {
      'id': list_id,
      'offset': 0,
      'total': true,
      'limit': 1000,
      'n': 1000,
      'csrf_token': ''
    },
    musicCookie,
    music_req => {
      // console.log('音乐列表请求成功');
      music_req = JSON.parse(music_req);
      if (music_req.code === 200) {
        music_req = music_req.playlist;
        redis.set('musicPlayerList', music_req);
        setTimeout(fetchMusicPlayerList, 1000 * 60 * 10);
        cacheSongDetail();
      } else {
        console.log('音乐列表获取失败');
      }
    },
    err => {
      console.log('音乐列表请求失败');
      setTimeout(fetchMusicPlayerList, 1000 * 60 * 10);
    }
  )
}

/*
console.log('音乐系统开始初始化！');
loginMusic();
fetchMusicPlayerList();
*/

// 获取某歌单列表
musicCtrl.list.GET = (req, res) => {
	const list_id = req.params.play_list_id;
	if (!list_id || Object.is(Number(list_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
  redis.get('musicPlayerList', (err, playerList) => {
    if (err) return handleError({ res, err, message: '歌曲列表获取失败' });
    handleSuccess({ res, result: playerList, message: '歌曲列表获取成功' });
  });
}

// 获取歌词（暂时没用）
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
  })
}

// 获取歌曲详情（暂时没用）
musicCtrl.song.GET = (req, res) => {
  const song_id = req.params.song_id;
	if (!song_id || Object.is(Number(song_id), NaN)) {
		handleError({ res, message: '参数无效' });
		return false;
	}
  redis.get(`musicSongDetail-${song_id}`, (err, song_detail) => {
    if (err || !song_detail) {
      fetchMusicSongDetail(song_id, music_req => {
        redis.set(`musicSongDetail-${song_id}`, music_req);
        handleSuccess({ res, result: music_req, message: '歌曲详情获取成功' });
      }, err => {
        handleError({ res, err, message: '歌曲详情获取失败' });
      })
    } else {
      handleSuccess({ res, result: song_detail, message: '歌曲详情获取成功' });
    }
  })
}

// 未成功的反代
/*
musicCtrl.url.GET = (req, res) => {
  var jar = request.jar();
  var cookie = request.cookie("_ntes_nnid=2080762494d886001aae24fa688ec124,1487076984461; _ntes_nuid=2080762494d886001aae24fa688ec124; usertrack=ZUcIhlij/V4Nhh0MAwoEAg==; vjuids=-633c84e53.15a572890b9.0.f0c78468fe33f; NTES_CMT_USER_INFO=111811885%7C%E6%9C%89%E6%80%81%E5%BA%A6%E7%BD%91%E5%8F%8B06GxQJ%7C%7Cfalse%7CbTE4MTYxODI4OTY4QDE2My5jb20%3D; __utma=187553192.2112814117.1487142251.1493716713.1494232539.3; __utmz=187553192.1494232539.3.3.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __oc_uuid=a02f4a80-0f9f-11e7-858e-ad4c5144fc10; P_INFO=m18161828968@163.com|1494410173|0|rms|00&99|sxi&1494386321&rms#sxi&610100#10#0#0|181968&1|163&urs&rms|18161828968@163.com; vjlast=1487520961.1494509336.11; vinfo_n_f_l_n3=0d2b931155dbc3ae.1.10.1487520960731.1494293526700.1494509340155; _ga=GA1.2.2112814117.1487142251; JSESSIONID-WYYY=e3EqnrGKpJviZn3%2FgxWUq925kPzEVKwQzBuTdYMTWMNz1wfcpjHUghVGgNpxsMCiaW9kkw8xbOUVeWR8z%2BHDkTvlRjSHP%2FP%2FIfR%5CPwKIitTXODMXgWdxCVGGz7%5CSnWzS1dapEHe94yxfpfKEqSuHjAArUdnN%5COB5We%2BCAKKSI010QuzD%3A1495230145915; _iuqxldmzr_=32; __csrf=6d0f231c060d5fcb8d165a125428c43a; __utma=94650624.2112814117.1487142251.1495168393.1495228348.14; __utmb=94650624.9.10.1495228348; __utmc=94650624; __utmz=94650624.1495228348.14.8.utmcsr=baidu|utmccn=(organic)|utmcmd=organic");
  var url = `http://m10.music.126.net/20170519184735/28bb7000cc4195ae8b0fa7f51f60bd9f/ymusic/689f/4a43/b0cf/c05dc9797d15f680a4dd96d796728901.mp3`;
  jar.setCookie(cookie, url);
  request({ url, jar }, (err, response, body) => {
      console.log('response', response)
    if(!err && response.statusCode == 200) {
    } else {
      console.log('err', err)
    }
  })
}

exports.url = (req, res) => { handleRequest({ req, res, controller: musicCtrl.url })};
*/

exports.lrc = (req, res) => { handleRequest({ req, res, controller: musicCtrl.lrc })};
exports.list = (req, res) => { handleRequest({ req, res, controller: musicCtrl.list })};
exports.song = (req, res) => { handleRequest({ req, res, controller: musicCtrl.song })};
