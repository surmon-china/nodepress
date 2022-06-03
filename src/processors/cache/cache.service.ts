/**
 * @file Cache enhancer service
 * @module processor/cache/service
 * @author Surmon <https://github.com/surmon-china>
 */

import schedule from 'node-schedule'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { RedisCacheStore } from './cache.store'
import { redisLog, cacheLog } from './cache.logger'

export type CacheKey = string
export type CacheResult<T> = Promise<T>

// IO mode result
export interface CacheIOResult<T> {
  get(): CacheResult<T>
  update(): CacheResult<T>
}

export interface CachePromiseOption<T> {
  key: CacheKey
  promise(): CacheResult<T>
}

// IO mode option
export interface CachePromiseIOOption<T> extends CachePromiseOption<T> {
  ioMode?: boolean
}

// Interval mode
export type CacheIntervalResult<T> = () => CacheResult<T>
export interface CacheIntervalOption<T> {
  key: CacheKey
  promise(): CacheResult<T>
  // interval timeout mode
  timeout?: {
    error?: number
    success?: number
  }
  // interval timing mode
  timing?: {
    error: number
    schedule: any
  }
}

// Interval IO mode
export interface CacheIntervalIOOption<T> extends CacheIntervalOption<T> {
  ioMode?: boolean
}

/**
 * @class CacheService
 * @classdesc Global cache service
 * @example CacheService.get(CacheKey).then()
 * @example CacheService.set(CacheKey).then()
 * @example CacheService.promise({ option })()
 * @example CacheService.interval({ option })()
 */
@Injectable()
export class CacheService {
  private cacheStore!: RedisCacheStore
  private isReadied = false

  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    // https://github.com/redis/node-redis#events
    this.cacheStore = cacheManager.store as RedisCacheStore
    this.cacheStore.client.on('connect', () => {
      redisLog.info('connecting...')
    })
    this.cacheStore.client.on('reconnecting', () => {
      redisLog.warn('reconnecting...')
    })
    this.cacheStore.client.on('ready', () => {
      this.isReadied = true
      redisLog.info('readied.')
    })
    this.cacheStore.client.on('end', () => {
      this.isReadied = false
      redisLog.error('client end!')
    })
    this.cacheStore.client.on('error', (error) => {
      this.isReadied = false
      redisLog.error(`client error!`, error.message)
    })
    // connect
    this.cacheStore.client.connect()
  }

  public get<T>(key: CacheKey): CacheResult<T> {
    if (!this.isReadied) {
      return Promise.reject('Redis has not ready!')
    }
    return this.cacheStore.get(key)
  }

  public delete(key: CacheKey): CacheResult<void> {
    if (!this.isReadied) {
      return Promise.reject('Redis has not ready!')
    }
    return this.cacheStore.del(key)
  }

  public set(
    key: CacheKey,
    value: any,
    options?: {
      /** seconds */
      ttl: number
    }
  ): CacheResult<void> {
    if (!this.isReadied) {
      return Promise.reject('Redis has not ready!')
    }
    return this.cacheStore.set(key, value, options)
  }

  /**
   * @function promise
   * @description passive | sync mode, Promise -> Redis
   * @example CacheService.promise({ key: CacheKey, promise() }) -> promise()
   * @example CacheService.promise({ key: CacheKey, promise(), ioMode: true }) -> { get: promise(), update: promise() }
   */
  promise<T>(options: CachePromiseOption<T>): CacheResult<T>
  promise<T>(options: CachePromiseIOOption<T>): CacheIOResult<T>
  promise(options) {
    const { key, promise, ioMode = false } = options

    const doPromiseTask = async () => {
      const data = await promise()
      await this.set(key, data)
      return data
    }

    // passive mode
    const handlePromiseMode = async () => {
      const value = await this.get(key)
      return value !== null && value !== undefined ? value : await doPromiseTask()
    }

    // sync mode
    const handleIoMode = () => ({
      get: handlePromiseMode,
      update: doPromiseTask,
    })

    return ioMode ? handleIoMode() : handlePromiseMode()
  }

  /**
   * @function interval
   * @description timeout | timing mode, Promise -> Task -> Redis
   * @example CacheService.interval({ key: CacheKey, promise(), timeout: {} }) -> promise()
   * @example CacheService.interval({ key: CacheKey, promise(), timing: {} }) -> promise()
   */
  public interval<T>(options: CacheIntervalOption<T>): CacheIntervalResult<T>
  public interval<T>(options: CacheIntervalIOOption<T>): CacheIOResult<T>
  public interval<T>(options) {
    const { key, promise, timeout, timing, ioMode = false } = options

    const promiseTask = async (): Promise<T> => {
      const data = await promise()
      await this.set(key, data)
      return data
    }

    // timeout mode
    if (timeout) {
      const doPromise = () => {
        promiseTask()
          .then(() => {
            setTimeout(doPromise, timeout.success)
          })
          .catch((error) => {
            const time = timeout.error || timeout.success
            setTimeout(doPromise, time)
            cacheLog.warn(`timeout task failed! retry when after ${time / 1000}s,`, error)
          })
      }
      doPromise()
    }

    // timing mode
    if (timing) {
      const doPromise = () => {
        promiseTask()
          .then((data) => data)
          .catch((error) => {
            cacheLog.warn(`timing task failed! retry when after ${timing.error / 1000}s,`, error)
            setTimeout(doPromise, timing.error)
          })
      }
      doPromise()
      schedule.scheduleJob(timing.schedule, doPromise)
    }

    // passive mode
    const getKeyCache = () => this.get(key)

    // sync mode
    const handleIoMode = () => ({
      get: getKeyCache,
      update: promiseTask,
    })

    return ioMode ? handleIoMode() : getKeyCache
  }
}
