/**
 * Origin middleware.
 * @file Origin 中间件
 * @module middleware/origin
 * @author Surmon <https://github.com/surmon-china>
 */

import { Request, Response } from 'express';
import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { THttpErrorResponse, EHttpStatus } from '@app/interfaces/http.interface';
import { isProdMode } from '@app/app.environment';
import { CROSS_DOMAIN } from '@app/app.config';
import * as TEXT from '@app/constants/text.constant';

/**
 * @class OriginMiddleware
 * @classdesc 用于验证是否为非法来源请求
 */
@Injectable()
export class OriginMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next) {
    // 如果是生产环境，需要验证用户来源渠道，防止非正常请求
    if (isProdMode) {
      const { origin, referer } = request.headers;
      const checkHeader = field => !field || field.includes(CROSS_DOMAIN.allowedReferer);
      const isVerifiedOrigin = checkHeader(origin);
      const isVerifiedReferer = checkHeader(referer);
      if (!isVerifiedOrigin && !isVerifiedReferer) {
        return response.status(HttpStatus.UNAUTHORIZED).jsonp({
          status: EHttpStatus.Error,
          message: TEXT.HTTP_ANONYMOUS_TEXT,
          error: null,
        } as THttpErrorResponse);
      }
    }

    // 其他通行
    return next();
  }
}
