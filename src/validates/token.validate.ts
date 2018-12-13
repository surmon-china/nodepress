/**
 * Auth module.
 * @file auth 鉴权
 * @module utils/auth
 * @author Surmon <https://github.com/surmon-china>
 */

import * as jwt from 'jsonwebtoken';
import * as appConfig from '@app/app.config';

// 验证 Auth 是否存在
export const getAuthToken = request => {
  if (!request.headers || !request.headers.authorization) {
    return false;
  }
  const parts = request.headers.authorization.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
};

// 验证 Auth 有效性
export const isVerifiedToken = request => {
  const token = getAuthToken(request);
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
