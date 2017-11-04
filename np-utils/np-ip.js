/* 阿里云 ip 查询方法 */

const https = require('https');
const config = require('np-config');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 验证权限
const queryIpInfo = ip => {
	let data = null;
	let success = false;
	return new Promise((resolve, reject) => {
		const req = https.request({
			hostname: 'dm-81.data.aliyun.com',
			path: `/rest/160601/ip/getIpInfo.json?ip=${ip}`,
			port: 443,
			method: 'GET',
			protocol: 'https:',
			headers:{
				'Authorization': `APPCODE ${config.ALIYUN.ip}`,
			}
		}, res => {
			if (res.statusCode == 200) {
				success = true;
			}
			res.setEncoding('utf-8');
			res.on('data', chunk => {
				data = JSON.parse(chunk);
			});  
			res.on('end', () => {  
				if (success && data && data.code === 0) {
					resolve(data.data);
				} else {
					reject(data);
				}
			});
		});  
		req.on('error', err => {  
			reject(err);
		});  
		req.end();
	})
};

module.exports = queryIpInfo;
