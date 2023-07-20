/**
 * @file Cache interceptor
 * @module interceptor/cache
 * @author Surmon <https://github.com/surmon-china>
 */

import { tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { HttpAdapterHost } from '@nestjs/core'
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  RequestMethod,
  StreamableFile
} from '@nestjs/common'
import { getCacheKey, getCacheTTL } from '@app/decorators/cache.decorator'
import { CacheService } from '@app/processors/cache/cache.service'
import { UNDEFINED, isNil } from '@app/constants/value.constant'
import { getDecoratorCacheKey } from '@app/constants/cache.constant'
import logger from '@app/utils/logger'

const log = logger.scope('CacheInterceptor')

/**
 * @class CacheInterceptor
 * @classdesc Cache with ttl
 * @ref https://github.com/nestjs/cache-manager/blob/master/lib/interceptors/cache.interceptor.ts
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly cacheService: CacheService
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    // MARK: force disable cache
    // return next.handle()
    const key = this.trackBy(context)

    if (!key) {
      return next.handle()
    }

    const target = context.getHandler()
    const ttl = getCacheTTL(target)

    try {
      const value = await this.cacheService.get(getDecoratorCacheKey(key))
      if (!isNil(value)) {
        return of(value)
      }

      return next.handle().pipe(
        tap(async (response) => {
          if (response instanceof StreamableFile) {
            return
          }

          try {
            await this.cacheService.set(getDecoratorCacheKey(key), response, ttl)
          } catch (err) {
            log.warn(`An error has occurred when inserting "key: ${key}", "value: ${response}"`)
          }
        })
      )
    } catch (error) {
      return next.handle()
    }
  }

  /**
   * @function trackBy
   * @description
   *  1. CacheKey is required
   *  2. HTTP GET request only
   */
  trackBy(context: ExecutionContext): string | undefined {
    const { httpAdapter } = this.httpAdapterHost
    const isHttpApp = Boolean(httpAdapter?.getRequestMethod)
    const cacheKey = getCacheKey(context.getHandler())
    const request = context.switchToHttp().getRequest()
    const isGetRequest = isHttpApp && httpAdapter.getRequestMethod(request) === RequestMethod[RequestMethod.GET]
    return isHttpApp && isGetRequest && cacheKey ? cacheKey : UNDEFINED
    /*
    Cache priority strategy: HTTP > GET > Cache Key -> URL -> undefined
    const requestUrl = httpAdapter.getRequestUrl(request)
    console.debug('isMatchedCache', { isHttpApp, isGetRequest, cacheKey, requestUrl })
    return isHttpApp && isGetRequest ? (cacheKey || requestUrl) : undefined;
    */
  }
}
