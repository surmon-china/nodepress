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
  powered: ['vue2', 'angular2', 'node.js', 'mongodb', 'express', 'nginx']
}

// 全局信息
exports.APP = {
  ROOT_PATH: __dirname,
}
