// 路由管理

const config = require('./np-config');
const controller = require('./np-controller');
const jwt = require('jsonwebtoken');
const routes = app => {

  // 拦截器
  app.all('*', (req, res, next) => {

    // Set Header
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("X-Powered-By", 'Nodepress 1.0.0');

    // OPTIONS
    if (req.method == 'OPTIONS') {
      res.send(200);
      return false;
    }

    // 验证Auth
    const authToken = req => {
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (Object.is(parts.length, 2) && Object.is(parts[0], 'Bearer')) {
          return parts[1];
        }
      }
      return false;
    };

    // 验证权限
    const isVerified = () => {
      const token = authToken(req);
      if (token) {
        try {
          const decodedToken = jwt.verify(token, config.AUTH.jwtTokenSecret);
          if (decodedToken.exp > Math.floor(Date.now() / 1000)) {
            return true;
          }
        } catch (err) {}
      }
      return false;
    };

    // 拦截所有非管路员的非get请求（排除auth的post请求）
    if (!isVerified() &&
        !Object.is(req.method, 'GET')  && 
        !(Object.is(req.method, 'POST') && Object.is(req.url, '/auth'))
       ) {
      res.status(401).jsonp({ code: 0, message: '来者何人！' })
      return false;
    }

    next();
  });

  // Api
  app.get('/', (req, res) => {
    res.jsonp(config.INFO);
  });

  // Auth
  app.all('/auth', controller.auth);

  // 七牛Token
  app.all('/qiniu', controller.qiniu);

  // 全局option
  app.all('/option', controller.option);

  // Tag
  app.all('/tag', controller.tag.list);
  app.all('/tag/:tag_id', controller.tag.item);

  // Category
  app.all('/category', controller.category.list);
  app.all('/category/:category_id', controller.category.item);

  // Article
  app.all('/article', controller.article.list);
  app.all('/article/:article_id', controller.article.item);

  // announcement
  app.all('/announcement', controller.announcement.list);
  app.all('/announcement/:announcement_id', controller.announcement.item);

  // 404
  app.all('*', (req, res) => {
    res.status(404).jsonp({
      code: 0,
      message: '无效的API请求'
    })
  });
};

module.exports = routes;
