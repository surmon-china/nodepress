/*
*
* badu-seo-push 模块
*
*/

const request = require('request');
const config = require('app.config');

// 提交记录
exports.baiduSeoPush = urls => {
	// console.log('百度推送：', urls);
	request.post({
		url: `http://data.zz.baidu.com/urls?site=${config.BAIDU.site}&token=${config.BAIDU.token}`, 
		headers: { 'Content-Type': 'text/plain' },
		body: urls
	}, (error, response, body) => {
		console.log(urls, '百度推送结果：', error, body);
	})
}

// 更新记录
exports.baiduSeoUpdate = urls => {
	// console.log('百度更新：', urls);
	request.post({
		url: `http://data.zz.baidu.com/update?site=${config.BAIDU.site}&token=${config.BAIDU.token}`, 
		headers: { 'Content-Type': 'text/plain' },
		body: urls
	}, (error, response, body) => {
		console.log(urls, '百度更新结果：', error, body);
	})
}

// 删除记录
exports.baiduSeoDelete = urls => {
	// console.log('百度删除：', urls);
	request.post({
		url: `http://data.zz.baidu.com/del?site=${config.BAIDU.site}&token=${config.BAIDU.token}`, 
		headers: { 'Content-Type': 'text/plain' },
		body: urls
	}, (error, response, body) => {
		console.log(urls, '百度删除结果：', error, body);
	})
}
