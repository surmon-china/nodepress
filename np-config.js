const argv = require('yargs').argv;

exports.MONGODB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/NodePress`,
  username: argv.dbusername || 'DB_username',
  password: argv.dbpassword || 'DB_password'
}

exports.QINIU = {
  accessKey: argv.accessKey || 'your access key',
  secretKey: argv.secretKey || 'your secret key',
  bucket: argv.bucket || 'your bucket name',
  origin: argv.origin || 'http://nodepress.u.qiniudn.com',
  uploadURL: argv.uploadURL || 'http://up.qiniu.com/'
}

exports.AUTH = {
  data: argv.authdata || { user: 'root' },
  jwtTokenSecret: argv.authkey || 'nodepress',
  DEFAULT_PASSWORD: argv.defaultpassword || 'root'
}

exports.BAIDU = {
  site: argv.baidusite || 'your baidu site domain like : surmon.me',
  token: argv.baidutoken || 'your baidu seo push token'
}

exports.EMAIL = {
  account: argv.emailaccount || 'your email address like : admin@surmon.me',
  password: argv.emailpassword || 'your email password'
}

exports.COMMENT = {
  akismetKey: argv.akismetkey || 'your akismet Key',
  blacklistKeywords: argv.blacklistkeywords || 'your blacklist keywords string'
}

exports.APP = {
  ROOT_PATH: __dirname,
  LIMIT: 10,
  PORT: 8000
}

exports.INFO = {
  name: 'NodePress',
  version: '1.0.0',
  author: 'Surmon',
  site: 'https://surmon.me',
  powered: ['Vue.js', 'Nuxt.js', 'React', 'Angular2', 'Bootstrap', 'Jquery', 'Video.js', 'Node.js', 'MongoDB', 'Express', 'Nginx', 'Aliyun']
}
