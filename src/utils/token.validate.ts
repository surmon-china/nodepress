/**
 * Auth module.
 * @file auth 鉴权
 * @module utils/auth
 * @author Surmon <https://github.com/surmon-china>
 */

import * as jwt from 'jsonwebtoken';
import * as appConfig from '@app/app.config';

// 验证 Auth
const authToken = req => {
  if (!req.headers || !req.headers.authorization) {
    return false;
  }
  const parts = req.headers.authorization.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
};

// 验证权限
const authIsVerified = req => {
  const token = authToken(req);
  if (token) {
    try {
      const decodedToken = jwt.verify(token, appConfig.AUTH.jwtTokenSecret);
      return (decodedToken.exp > Math.floor(Date.now() / 1000));
    } catch (err) {
      return false;
    }
  }
  return false;
};

module.exports = authIsVerified;
