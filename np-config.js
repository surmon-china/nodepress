// 数据库配置
exports.MONGODB = {
  uri: 'mongodb://localhost:27017/NodePress',
  username: 'DB_username',
  password: 'DB_password'
}


exports.INFO = {
  name: 'NodePress',
  version: '1.0.0',
  author: 'Surmon',
  site: 'http://surmon.me',
  powered: ['Vue2', `Weex`, 'React', 'Angular2', 'Bootstrap', 'Jquery', 'Video.js', 'Node.js', 'MongoDB', 'Express', 'Nginx', 'Aliyun']
}

// 全局信息
exports.APP = {
  ROOT_PATH: __dirname,
  LIMIT: 12,
  PORT: 8000
}
