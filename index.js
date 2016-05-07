// 程序配置
require('./np-config.js');

// 路由
require('./np-routes.js');

//数据库
require('./np-mongodb.js');

// 全局变量
global.config = {
  name: 'NodePress',
  version: '0.0.1',
  api_url: '/api',
  author: 'Surmon',
  site: 'http://surmon.me'
};

// 路由
require('./np-routes.js');