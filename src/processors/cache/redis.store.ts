/**
 * @file Redis store
 * @module processor/cache/redis.store
 * @author Surmon <https://github.com/surmon-china>
 */

// https://github.com/jaredwray/cacheable
// https://github.com/node-cache-manager/node-cache-manager
// https://github.com/dabroek/node-cache-manager-redis-store/blob/master/index.js

import { isNil, isUndefined, UNDEFINED } from '@app/constants/value.constant'
import type { RedisClientType } from './redis.service'

export type RedisStore = ReturnType<typeof createRedisStore>

const stringifyValue = (value: unknown) => {
  return isNil(value) ? '' : JSON.stringify(value)
}

const parseValue = <T>(value: string | null | void) => {
  return isNil(value) ? UNDEFINED : (JSON.parse(value) as T)
}

export interface RedisStoreOptions {
  namespace?: string
  defaultTTL?: number
}

export const createRedisStore = (redisClient: RedisClientType, options?: RedisStoreOptions) => {
  const getKeyName = (key: string): string => {
    return options?.namespace ? `${options.namespace}:${key}` : key
  }

  const get = async <T>(key: string) => {
    const value = await redisClient.get(getKeyName(key))
    return parseValue<T>(value)
  }

  // https://redis.io/commands/set/
  const set = async (key: string, value: any, ttl?: number): Promise<void> => {
    const _key = getKeyName(key)
    const _value = stringifyValue(value)
    const _ttl = isUndefined(ttl) ? options?.defaultTTL : ttl
    if (!isNil(_ttl) && _ttl !== 0) {
      // EX — Set the specified expire time, in seconds.
      await redisClient.set(_key, _value, { expiration: { type: 'EX', value: _ttl } })
    } else {
      await redisClient.set(_key, _value)
    }
  }

  const mset = async (kvs: [string, any][], ttl?: number): Promise<void> => {
    const _ttl = isUndefined(ttl) ? options?.defaultTTL : ttl
    if (!isNil(_ttl) && _ttl !== 0) {
      const multi = redisClient.multi()
      for (const [key, value] of kvs) {
        // EX — Set the specified expire time, in seconds.
        multi.set(getKeyName(key), stringifyValue(value), { expiration: { type: 'EX', value: _ttl } })
      }
      await multi.exec()
    } else {
      await redisClient.mSet(
        kvs.map(([key, value]) => {
          return [getKeyName(key), stringifyValue(value)] as [string, string]
        })
      )
    }
  }

  const mget = (...keys: string[]) => {
    return redisClient.mGet(keys.map(getKeyName)).then((values) => {
      return values.map((value) => parseValue<unknown>(value))
    })
  }

  const mdel = async (...keys: string[]) => {
    await redisClient.del(keys.map(getKeyName))
  }

  const del = async (key: string) => {
    const deleted = await redisClient.del(getKeyName(key))
    return deleted > 0
  }

  const has = async (key: string) => {
    const count = await redisClient.exists(getKeyName(key))
    return count !== 0
  }

  const ttl = (key: string) => redisClient.ttl(getKeyName(key))
  const keys = (pattern = getKeyName('*')) => redisClient.keys(pattern)

  const clear = async () => {
    await redisClient.del(await keys())
  }

  return {
    has,
    get,
    set,
    delete: del,
    mset,
    mget,
    mdel,
    ttl,
    keys,
    clear
  }
}
