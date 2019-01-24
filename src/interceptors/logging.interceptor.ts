/**
 * Logging interceptor.
 * @file 日志拦截器
 * @module interceptor/logging
 * @author Surmon <https://github.com/surmon-china>
 */

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { isDevMode } from '@app/app.environment';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    if (!isDevMode) {
      return call$;
    }
    const request = context.switchToHttp().getRequest();
    const content = request.method + ' -> ' + request.url;
    console.log('+ 收到请求：', content);
    const now = Date.now();
    return call$.pipe(
      tap(() => console.log('- 响应请求：', content, `${Date.now() - now}ms`)),
    );
  }
}
