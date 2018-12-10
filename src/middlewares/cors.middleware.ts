import { INFO, CROSS_DOMAIN } from '@app/app.config';
import { isDevMode } from '@app/app.environment';
import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {

      // Set Header
      const origin = req.headers.origin || '';
      const allowedOrigins = [...CROSS_DOMAIN.allowedOrigins];

      // Allow Origin
      if (allowedOrigins.includes(origin) || isDevMode) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

      // Headers
      // tslint:disable-next-line:max-line-length
      res.header('Access-Control-Allow-Headers', 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');
      res.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS');
      res.header('Access-Control-Max-Age', '1728000');
      res.header('Content-Type', 'application/json;charset=utf-8');
      res.header('X-Powered-By', `Nodepress ${INFO.version}`);

      // OPTIONS Request
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      } else {
        return next();
      }
    };
  }
}