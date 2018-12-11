import { CROSS_DOMAIN } from '@app/app.config';
import { isProdMode } from '@app/app.environment';
import { THttpErrorResponse, EStatus } from '@app/interfaces/http';
import { Injectable, NestMiddleware, MiddlewareFunction, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (request, response, next) => {

      // errorResBody
      const errorResBody: THttpErrorResponse = {
        status: EStatus.Error,
        message: '来者何人！',
        error: null,
      };

      const unauthorizedResponse = res => {
        return res.status(HttpStatus.UNAUTHORIZED).jsonp(errorResBody);
      };

      // 如果是生产环境，需要验证用户来源渠道，防止非正常请求
      if (isProdMode) {
        const { origin, referer } = request.headers;
        const checkHeader = field => !field || field.includes(CROSS_DOMAIN.allowedReferer);
        const isVerifiedOrigin = checkHeader(origin);
        const isVerifiedReferer = checkHeader(referer);
        if (!isVerifiedOrigin && !isVerifiedReferer) {
          return unauthorizedResponse(response);
        }
      }

      const isNotGetRequest = request.method !== 'GET';
      const isPostRequest = req => req.method === 'POST';
      const isUrlRequest = (req, url) => req.url === url;
      const isPostUrlRequest = (req, url) => isUrlRequest(req, url) && isPostRequest(req);

      // 文件 token 请求
      const isFileRequest = isUrlRequest(request, '/qiniu');
      // 喜欢操作
      const isLikeRequest = isPostUrlRequest(request, '/like');
      // 登陆操作
      const isPostAuthRequest = isPostUrlRequest(request, '/auth');
      // 提交评论
      const isPostCommentRequest = isPostUrlRequest(request, '/comment');
      // 非管理员
      const isGuestRequest = !authIsVerified(request);

      // 排除 -> auth.POST & comment.POST & like.POST
      if (isLikeRequest || isPostAuthRequest || isPostCommentRequest) {
        return next();
      }

      // 拦截 -> 所有非管理员的 -> 非 GET 请求 / 文件上传请求
      if (isGuestRequest && (isNotGetRequest || isFileRequest)) {
        return unauthorizedResponse(response);
      }

      // 其他情况都通行
      next();
    };
  }
}