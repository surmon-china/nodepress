/**
 * @file HttpCache interceptor
 * @module interceptor/cache
 * @author Surmon <https://github.com/surmon-china>
 */

import { tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import {
  HttpAdapterHost,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Injectable,
  RequestMethod,
} from '@nestjs/common'
import { getHttpCacheKey, getHttpCacheTTL } from '@app/decorators/cache.decorator'
import { CacheService } from '@app/processors/cache/cache.service'
import * as SYSTEM from '@app/constants/system.constant'
import * as APP_CONFIG from '@app/app.config'

/**
 * @class HttpCacheInterceptor
 * @classdesc Cache with ttl
 */
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(SYSTEM.HTTP_ADAPTER_HOST)
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly cacheService: CacheService
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    // MARK: force disable cache
    // return call$;
    const call$ = next.handle()
    const key = this.trackBy(context)

    if (!key) {
      return call$
    }

    const target = context.getHandler()
    const metaTTL = getHttpCacheTTL(target)
    const ttl = metaTTL || APP_CONFIG.APP.DEFAULT_CACHE_TTL

    try {
      const value = await this.cacheService.get(key)
      return value ? of(value) : call$.pipe(tap((response) => this.cacheService.set(key, response, { ttl })))
    } catch (error) {
      return call$
    }
  }

  /**
   * @function trackBy
   * @description
   *  1. CacheKey is required
   *  2. default ttl: APP_CONFIG.REDIS.defaultCacheTTL
   */
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest()
    const httpServer = this.httpAdapterHost.httpAdapter
    const isHttpApp = Boolean(httpServer?.getRequestMethod)
    const isGetRequest = isHttpApp && httpServer.getRequestMethod(request) === RequestMethod[RequestMethod.GET]
    const cacheKey = getHttpCacheKey(context.getHandler())
    const isMatchedCache = isHttpApp && isGetRequest && cacheKey
    // const requestUrl = httpServer.getRequestUrl(request);
    // console.debug('isMatchedCache', isMatchedCache, 'requestUrl', requestUrl, 'cacheKey', cacheKey);
    // cache priority strategy: -> http -> GET -> cache key -> url -> undefined
    return isMatchedCache ? cacheKey : undefined
    /*
    return undefined;
    return isMatchedCache ? requestUrl : undefined;
    return isMatchedCache ? (cacheKey || requestUrl) : undefined;
    */
  }
}
