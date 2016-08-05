
// 引入配置
const CONFIG   = require('../np-config');

// 视图路由
exports.index = (req, res) => {
  res.sendfile(CONFIG.APP.ROOT_PATH + '/np-public/np-theme/Surmon/index.html');
};

// API路由
exports.admin = (req, res) => {
  res.sendfile(CONFIG.APP.ROOT_PATH + '/np-public/np-admin/index.html');
};