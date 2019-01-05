import { CROSS_DOMAIN } from '@app/app.config';
import { isProdMode } from '@app/app.environment';
import { isVerifiedToken } from '@app/validates/token.validate';
import { THttpErrorResponse, EHttpStatus } from '@app/interfaces/http.interface';
import { Injectable, NestMiddleware, MiddlewareFunction, HttpStatus, RequestMethod } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (request, response, next) => {

      // errorResBody
      const errorResBody: THttpErrorResponse = {
        status: EHttpStatus.Error,
        message: '来者何人！',
        error: null,
      };

      // 发送拦截请求
      const sendUnauthorizedResponse = res => {
        return res.status(HttpStatus.UNAUTHORIZED).jsonp(errorResBody);
      };

      // 如果是生产环境，需要验证用户来源渠道，防止非正常请求
      if (isProdMode) {
        const { origin, referer } = request.headers;
        const checkHeader = field => !field || field.includes(CROSS_DOMAIN.allowedReferer);
        const isVerifiedOrigin = checkHeader(origin);
        const isVerifiedReferer = checkHeader(referer);
        if (!isVerifiedOrigin && !isVerifiedReferer) {
          return sendUnauthorizedResponse(response);
        }
      }

      // 排除检查权限的路由
      const excludes = [
        { url: '/like', method: RequestMethod.POST },
        { url: '/auth', method: RequestMethod.POST },
        { url: '/comment', method: RequestMethod.POST },
      ];

      // 需要检查权限的路由
      const includes = [
        { url: '/qiniu', method: RequestMethod.GET },
        { url: '*', method: RequestMethod.PUT },
        { url: '*', method: RequestMethod.POST },
        { url: '*', method: RequestMethod.PATCH },
        { url: '*', method: RequestMethod.DELETE },
      ];

      const isSameUrl = rule => request.baseUrl === rule.url || rule.url === '*';
      const isSameMethod = rule => request.method === RequestMethod[rule.method] || rule.method === RequestMethod.ALL;
      const isMatchRule = rule => isSameUrl(rule) && isSameMethod(rule);
      const isExcludeRule = excludes.some(isMatchRule);
      const isIncludeRule = includes.some(isMatchRule);
      const isValidToken = isVerifiedToken(request);

      // 不属于排除规则 &&（属于命中规则 && 验证失败）
      if (!isExcludeRule && (isIncludeRule && !isValidToken)) {
        return sendUnauthorizedResponse(response);
      }

      // 其他通行
      return next();
    };
  }
}