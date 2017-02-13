

const config = require('./np-config');
const jwt = require('jsonwebtoken');

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
const authIsVerified = req => {
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

module.exports = authIsVerified;