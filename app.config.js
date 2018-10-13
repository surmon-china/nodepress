/**
 * App config module.
 * @file 应用运行配置
 * @module app.config
 * @author Surmon <https://github.com/surmon-china>
 */

const { argv } = require('yargs')
const package = require('package')

exports.APP = {
	LIMIT: 16,
	PORT: 8000,
	ROOT_PATH: __dirname,
	NAME: 'Surmon.me',
	URL: 'https://surmon.me'
}

exports.CROSS_DOMAIN = {
	allowedOrigins: ['https://surmon.me', 'https://admin.surmon.me'],
	allowedReferer: 'surmon.me'
}

exports.MONGODB = {
	uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/NodePress`,
	username: argv.db_username || 'DB_username',
	password: argv.db_password || 'DB_password'
}
exports.AUTH = {
	data: argv.auth_data || { user: 'root' },
	jwtTokenSecret: argv.auth_key || 'nodepress',
	defaultPassword: argv.auth_default_password || 'root'
}

exports.EMAIL = {
	account: argv.email_account || 'your email address like : i@surmon.me',
	password: argv.email_password || 'your email password',
	from: '"Surmon" <i@surmon.me>',
	admin: 'surmon@foxmail.com'
}

exports.AKISMET = {
	key: argv.akismet_key || 'your akismet Key',
	blog: argv.akismet_blog || 'your akismet blog site, like: https://surmon.me'
}

exports.GITHUB = {
	username: 'surmon-china',
}

exports.QINIU = {
	accessKey: argv.qn_accessKey || 'your access key',
	secretKey: argv.qn_secretKey || 'your secret key',
	bucket: argv.qn_bucket || 'your bucket name',
	origin: argv.qn_origin || 'http://nodepress.u.qiniudn.com',
	uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/'
}

exports.BAIDU = {
	site: argv.baidu_site || 'your baidu site domain like : surmon.me',
	token: argv.baidu_token || 'your baidu seo push token'
}

exports.ALIYUN = {
	ip: argv.aliyun_ip_auth
}

exports.INFO = {
	name: package.name,
	version: package.version,
	author: package.author,
	site: exports.APP.URL,
	github: 'https://github.com/surmon-china',
	powered: ['Vue', 'Nuxt.js', 'ReactNative', 'Angular', 'Bootstrap4', 'Nodejs', 'MongoDB', 'Express', 'Nginx']
}
