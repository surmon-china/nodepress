/**
 * @file Redis store
 * @module processor/cache/redis.store
 * @author Surmon <https://github.com/surmon-china>
 */

// https://github.com/node-cache-manager/node-cache-manager
// https://github.com/dabroek/node-cache-manager-redis-store/blob/master/index.js
// https://github.com/node-cache-manager/node-cache-manager-redis-yet/blob/master/src/index.ts

import type { RedisClientType } from 'redis'
import { isNil, isUndefined, UNDEFINED } from '@app/constants/value.constant'

export type { RedisClientOptions } from 'redis'
export type RedisStore = ReturnType<typeof createRedisStore>

const stringifyValue = (value: unknown) => {
  return isNil(value) ? '' : JSON.stringify(value)
}

const parseValue = <T>(value: string | null | void) => {
  return isNil(value) ? UNDEFINED : (JSON.parse(value) as T)
}

export const createRedisStore = (redisClient: RedisClientType, defaultTTL?: number) => {
  const get = async <T>(key: string) => {
    const value = await redisClient.get(key)
    return parseValue<T>(value)
  }

  // https://redis.io/commands/set/
  const set = async (key: string, value: any, ttl?: number): Promise<void> => {
    const _value = stringifyValue(value)
    const _ttl = isUndefined(ttl) ? defaultTTL : ttl
    if (!isNil(_ttl) && _ttl !== 0) {
      // EX — Set the specified expire time, in seconds.
      await redisClient.set(key, _value, { EX: _ttl })
    } else {
      await redisClient.set(key, _value)
    }
  }

  const mset = async (args, ttl?: number): Promise<void> => {
    const _ttl = isUndefined(ttl) ? defaultTTL : ttl
    if (!isNil(_ttl) && _ttl !== 0) {
      const multi = redisClient.multi()
      for (const [key, value] of args) {
        // EX — Set the specified expire time, in seconds.
        multi.set(key, stringifyValue(value), { EX: _ttl })
      }
      await multi.exec()
    } else {
      await redisClient.mSet(
        args.map(([key, value]) => {
          return [key, stringifyValue(value)] as [string, string]
        })
      )
    }
  }

  const mget = (...args) => {
    return redisClient.mGet(args).then((values) => {
      return values.map((value) => parseValue<unknown>(value))
    })
  }

  const mdel = async (...args) => {
    await redisClient.del(args)
  }

  const del = async (key: string) => {
    await redisClient.del(key)
  }

  const reset = async () => {
    await redisClient.flushDb()
  }

  const ttl = (key: string) => redisClient.pTTL(key)

  const keys = (pattern = '*') => redisClient.keys(pattern)

  return {
    get,
    set,
    mset,
    mget,
    mdel,
    del,
    reset,
    ttl,
    keys
  }
}
