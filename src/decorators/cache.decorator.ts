/**
 * @file Cache decorator
 * @module decorator/cache
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { SetMetadata } from '@nestjs/common'
import { reflector } from '@app/constants/reflector.constant'
import * as META from '@app/constants/meta.constant'

export interface HttpCacheOption {
  ttl?: number
  key?: string
}

/**
 * @function HttpCache
 * @example `@HttpCache(CACHE_KEY, 60 * 60)`
 * @example `@HttpCache({ key: CACHE_KEY, ttl: 60 * 60 })`
 */
export function HttpCache(option: HttpCacheOption): MethodDecorator
export function HttpCache(key: string, ttl?: number): MethodDecorator
export function HttpCache(...args) {
  const option = args[0]
  const isOption = (value): value is HttpCacheOption => lodash.isObject(value)
  const key: string = isOption(option) ? option.key : option
  const ttl: number = isOption(option) ? option.ttl : args[1] || null
  return (_, __, descriptor: PropertyDescriptor) => {
    if (key) {
      // CacheKey(key)(descriptor.value)
      SetMetadata(META.HTTP_CACHE_KEY_METADATA, key)(descriptor.value)
    }
    if (ttl) {
      SetMetadata(META.HTTP_CACHE_TTL_METADATA, ttl)(descriptor.value)
    }
    return descriptor
  }
}

export const getHttpCacheKey = (target: any): HttpCacheOption['key'] => {
  return reflector.get(META.HTTP_CACHE_KEY_METADATA, target)
}

export const getHttpCacheTTL = (target: any): HttpCacheOption['ttl'] => {
  return reflector.get(META.HTTP_CACHE_TTL_METADATA, target)
}
