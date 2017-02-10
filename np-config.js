const argv = require('yargs').argv;
// console.log(argv)

exports.MONGODB = {
  uri: 'mongodb://127.0.0.1:27017/NodePress',
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

exports.INFO = {
  name: 'NodePress',
  version: '1.0.0',
  author: 'Surmon',
  site: 'https://surmon.me',
  powered: ['Vue2', 'Nuxt.js', 'React', 'Angular2', 'Bootstrap', 'Jquery', 'Video.js', 'Node.js', 'MongoDB', 'Express', 'Nginx', 'Aliyun']
}

exports.APP = {
  ROOT_PATH: __dirname,
  LIMIT: 10,
  PORT: 8000
}
