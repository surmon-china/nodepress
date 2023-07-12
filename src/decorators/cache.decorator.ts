/**
 * @file Cache decorator
 * @module decorator/cache
 * @author Surmon <https://github.com/surmon-china>
 * @ref https://github.com/nestjs/cache-manager/tree/master/lib/decorators
 */

import lodash from 'lodash'
import { SetMetadata } from '@nestjs/common'
import { reflector } from '@app/constants/reflector.constant'
import { NULL } from '@app/constants/value.constant'
import * as META from '@app/constants/meta.constant'

export interface CacheOptions {
  /** This field to be used as a cache key */
  key: string
  /** set the cache expiration time (seconds) */
  ttl?: number
}

/**
 * @function Cache
 * @example ```@Cache(CACHE_KEY, 60 * 60)```
 * @example ```@Cache({ key: CACHE_KEY, ttl: 60 * 60 })```
 */
export function Cache(option: CacheOptions): MethodDecorator
export function Cache(key: string, ttl?: number): MethodDecorator
export function Cache(...args) {
  const option = args[0]
  const isOption = (value): value is CacheOptions => lodash.isObject(value)
  const key: string = isOption(option) ? option.key : option
  const ttl: number = isOption(option) ? option.ttl : args[1] || NULL
  return (_, __, descriptor: PropertyDescriptor) => {
    if (key) {
      SetMetadata(META.CACHE_KEY_METADATA, key)(descriptor.value)
    }
    if (ttl) {
      SetMetadata(META.CACHE_TTL_METADATA, ttl)(descriptor.value)
    }
    return descriptor
  }
}

export const getCacheKey = (target: any): CacheOptions['key'] => {
  return reflector.get(META.CACHE_KEY_METADATA, target)
}

export const getCacheTTL = (target: any): CacheOptions['ttl'] => {
  return reflector.get(META.CACHE_TTL_METADATA, target)
}
