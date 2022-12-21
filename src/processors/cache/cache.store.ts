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

  const todo = {
    /** @deprecated */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async mget(...args: string[]): Promise<unknown[]> {
      return []
    },
    /** @deprecated */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async mset(args: [string, unknown][], ttl?: number): Promise<void> {},
    /** @deprecated */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async mdel(...args: string[]): Promise<void> {},
    /** @deprecated */
    async reset() {},
    /** @deprecated */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async keys(pattern?: string): Promise<string[]> {
      return []
    },
    /** @deprecated */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ttl(key: string): Promise<number> {
      return 0
    },
  }

  return { client, ...todo, set, get, del }
}

const redisStoreFactory: CacheStoreFactory = {
  create: createRedisStore,
}

export default redisStoreFactory
