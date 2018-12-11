import { isProdMode } from '@app/app.environment';
import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      console.log('Request...');
      // 如果是生产环境，需要验证用户来源渠道，防止非正常请求
      if (isProdMode) {
        const { origin, referer } = req.headers;
        const originVerified = !origin || origin.includes(CONFIG.CROSS_DOMAIN.allowedReferer);
        const refererVerified = !referer || referer.includes(CONFIG.CROSS_DOMAIN.allowedReferer);
        if (!originVerified && !refererVerified) {
          return res.status(403).jsonp({ code: 0, message: '来者何人！' });
        }
      }

      // 排除 (auth 的 post 请求) & (评论的 post 请求) & (like post 请求)
      const isPostUrl = (req, url) => Object.is(req.url, url) && Object.is(req.method, 'POST');
      const isLike = isPostUrl(req, '/like');
      const isPostAuth = isPostUrl(req, '/auth');
      const isPostComment = isPostUrl(req, '/comment');
      if (isLike || isPostAuth || isPostComment) {
        return next();
      }

      // 拦截（所有非管路员的非 get 请求，或文件上传请求）
      const notGetRequest = req.method !== 'GET';
      const isFileRequest = req.url === '/qiniu';
      const isGuestRequest = !authIsVerified(req);
      if (isGuestRequest && (notGetRequest || isFileRequest)) {
        return res.status(401).jsonp({ code: 0, message: '来者何人！' });
      }

      // 其他情况都通行
      next();
    };
  }
}