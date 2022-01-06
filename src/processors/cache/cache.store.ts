/**
 * @file Redis cache store
 * @module processor/cache/store
 * @author Surmon <https://github.com/surmon-china>
 */

import { createClient } from 'redis'
import { CacheStoreFactory, CacheStoreSetOptions, CacheModuleOptions } from '@nestjs/common'

export type RedisStoreOptions = Parameters<typeof createClient>[0]
export type RedisCacheStore = ReturnType<typeof createRedisStore>
export interface CacheStoreOptions extends CacheModuleOptions {
  redisOptions: RedisStoreOptions
}

const createRedisStore = (options: CacheStoreOptions) => {
  const client = createClient(options.redisOptions)

  const set = async <T>(key: string, value: T, options: CacheStoreSetOptions<T> = {}): Promise<void> => {
    const { ttl } = options
    const _value = value ? JSON.stringify(value) : ''
    if (ttl) {
      const _ttl = typeof ttl === 'function' ? ttl(value) : ttl
      // https://redis.io/commands/setex
      await client.setEx(key, _ttl, _value)
    } else {
      await client.set(key, _value)
    }
  }

  const get = async <T>(key: string): Promise<T> => {
    const value = await client.get(key)
    return value ? JSON.parse(value) : value
  }

  const del = async (key: string) => {
    await client.del(key)
  }

  return { set, get, del, client }
}

const redisStoreFactory: CacheStoreFactory = {
  create: createRedisStore,
}

export default redisStoreFactory
