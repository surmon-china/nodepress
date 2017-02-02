exports.MONGODB = {
  uri: 'mongodb://localhost:27017/NodePress',
  username: 'DB_username',
  password: 'DB_password'
}

exports.QINIU = {
  accessKey: 'Me09Zx9_QyBJuViVxy_UP-KC9tUQu7t9RLBg207N',
  secretKey: 'ZwFYrSsCB1mSXnIsH4VR9JpIy-Bc-YLlk3SMMNae',
  bucket: 'nodepress',
  origin: 'http://nodepress.u.qiniudn.com',
  uploadURL: 'http://up.qiniu.com/'
}

exports.AUTH = {
  data: { user: 'root' },
  jwtTokenSecret: 'nodepress',
  DEFAULT_PASSWORD: 'root'
}

exports.INFO = {
  name: 'NodePress',
  version: '1.0.0.1',
  author: 'Surmon',
  site: 'http://api.surmon.me',
  powered: ['Vue2', 'React', 'Angular2', 'Bootstrap', 'Jquery', 'Video.js', 'Node.js', 'MongoDB', 'Express', 'Nginx', 'Aliyun']
}

exports.APP = {
  ROOT_PATH: __dirname,
  LIMIT: 10,
  PORT: 8000
}
