exports.MONGODB = {
  uri: 'mongodb://localhost:27017/NodePress',
  username: 'DB_username',
  password: 'DB_password'
}

exports.QINIU = {
  accessKey: 'Me09Zqwex9_QyBJuViVxy_UP-KC9tUQu7t9RLBg207N',
  secretKey: 'ZwFYrS123123sCB1mSXnIsH4VR9JpIy-Bc-YLlk3SMMNae',
  bucket: 'nodepress',
  origin: 'http://nodepress.u.qiniudn.com',
  uploadURL: 'http://up.qiniu.com/'
}

exports.INFO = {
  name: 'NodePress',
  version: '1.0.0',
  author: 'Surmon',
  site: 'http://surmon.me',
  powered: ['Vue2', `Weex`, 'React', 'Angular2', 'Bootstrap', 'Jquery', 'Video.js', 'Node.js', 'MongoDB', 'Express', 'Nginx', 'Aliyun']
}

exports.APP = {
  ROOT_PATH: __dirname,
  LIMIT: 10,
  PORT: 8000
}
