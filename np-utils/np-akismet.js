/*
*
* akismet-spam 反垃圾模块
*
*/

const akismet = require('akismet-api');
const config = require('app.config');

const client = akismet.client({
	key: config.AKISMET.key,
	blog: config.AKISMET.blog
});

let clientIsValid = false;

// check key
client.verifyKey().then(valid => {
	clientIsValid = valid;
	console.log(`Akismet key ${ valid ? '有效' : '无效' }!`);
}).catch(err => {
	console.warn('Akismet VerifyKey Error:', err.message);
});

// check spam
const checkSpam = comment => {
	console.log('Akismet 验证评论中...', new Date());
	return new Promise((resolve, solve) => {
		if (clientIsValid) {
			client.checkSpam(comment).then(spam => {
				if (spam) {
					console.warn('Akismet 验证不通过!', new Date());
					solve(new Error('spam!'));
				} else {
					console.log('Akismet 验证通过', new Date());
					resolve(spam);
				}
			}).catch(err => {
				resolve(err);
			});
		} else {
			console.warn('Akismet key 未认证，放弃验证');
			resolve('akismet key Invalid!');
		}
	});
};


// submit Interceptor
const handleCommentInterceptor = handle_type => {
	return comment => {
		if (clientIsValid) {
			console.log(`Akismet ${handle_type}...`, new Date());
			client[handle_type](comment).then(result => {
				console.log(`Akismet ${handle_type} success!`);
			}).catch(err => {
				console.warn(`Akismet ${handle_type} failed!`, err);
			});
		} else {
			console.warn('Akismet key Invalid!');
		}
	};
};

// akismet client
const akismetClient = {

	// check spam
	checkSpam,

	// submit spam
	submitSpam: handleCommentInterceptor('submitSpam'),

	// submit ham
	submitHam: handleCommentInterceptor('submitHam')
};

exports.akismet = akismet;
exports.akismetClient = akismetClient;
