/*
*
* 获取头像控制器
*
*/

const { handleError, handleSuccess } = require('np-utils/np-handle');
const gravatar = require('np-utils/np-gravatar');
const config = require('np-config');
const request = require('request');
const fs = require('fs');

const anonymous = fs.readFileSync(`${config.APP.ROOT_PATH}/../surmon.me.new/static/images/anonymous.jpg`);

module.exports = (req, res) => {
	console.log(req.query);
	let gravatar_url = gravatar.url('sur2mon@foxmail.com', { 
		size: '96', 
		rating: 'pg',
		// default: '404',
		// default: 'https://avatar.duoshuo.com/avatar-50/772/311955.jpg', 
		protocol: 'https'
	});

	gravatar_url = gravatar_url.replace('https://s.gravatar.com', 'http://gravatar.duoshuo.com')
	console.log(gravatar_url);

  const localReq = request({ uri: gravatar_url });
  req.pipe(localReq);
  localReq.pipe(res);
};
