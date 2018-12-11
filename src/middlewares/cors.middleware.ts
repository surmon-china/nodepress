import { INFO, CROSS_DOMAIN } from '@app/app.config';
import { isDevMode } from '@app/app.environment';
import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {

      const origin = req.headers.origin || '';
      const allowedOrigins = [...CROSS_DOMAIN.allowedOrigins];
      const allowedMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
      const allowedHeaders = ['Authorization', 'Origin', 'No-Cache', 'X-Requested-With', 'If-Modified-Since', 'Pragma', 'Last-Modified', 'Cache-Control', 'Expires', 'Content-Type', 'X-E4M-With'];

      // Allow Origin
      if (!origin || allowedOrigins.includes(origin) || isDevMode) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
      }

      // Headers
      res.header('Access-Control-Allow-Headers', allowedHeaders.join(','));
      res.header('Access-Control-Allow-Methods',  allowedMethods.join(','));
      res.header('Access-Control-Max-Age', '1728000');
      res.header('Content-Type', 'application/json; charset=utf-8');
      res.header('X-Powered-By', `Nodepress ${INFO.version}`);

      // OPTIONS Request
      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      } else {
        return next();
      }
    };
  }
}