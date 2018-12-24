
import * as META from '@app/constants/meta.constant';
import * as APP_CONFIG from '@app/app.config';
import { CacheInterceptor, ExecutionContext, Injectable, RequestMethod } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {

  // 自定义装饰器，修饰 ttl 参数
  async intercept(context: ExecutionContext, call$: Observable<any>): Promise<Observable<any>> {
    // 如果想彻底禁用缓存服务，还是直接返回数据吧
    // return call$;
    const key = this.trackBy(context);
    const target = context.getHandler();
    const metaTTL = this.reflector.get(META.HTTP_CACHE_TTL_METADATA, target);
    const ttl = metaTTL || APP_CONFIG.REDIS.defaultCacheTTL;
    // console.log('HttpCacheInterceptor intercept', key, ttl);
    if (!key) {
      return call$;
    }
    try {
      const value = await this.cacheManager.get(key);
      return value ? of(value) : call$.pipe(
        tap(response => this.cacheManager.set(key, response, { ttl })),
      );
    }
    catch (error) {
      return call$;
    }
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const httpServer = this.applicationRefHost.applicationRef;
    const isHttpApp = httpServer && !!httpServer.getRequestMethod;
    const isGetRequest = isHttpApp && httpServer.getRequestMethod(request) === RequestMethod[RequestMethod.GET];
    const requestUrl = httpServer.getRequestUrl(request);
    const cacheKey = this.reflector.get(META.HTTP_CACHE_KEY_METADATA, context.getHandler());
    const isHitCache = isHttpApp && isGetRequest && cacheKey;
    // console.log('isHitCache', isHitCache, 'requestUrl', requestUrl, 'cacheKey', cacheKey);
    // 缓存命中策略 -> http -> GET -> cachekey -> url -> undefined
    return isHitCache ? cacheKey : undefined;
    /*
    return undefined;
    return isHitCache ? requestUrl : undefined;
    return isHitCache ? (cacheKey || requestUrl) : undefined;
    */
  }
}