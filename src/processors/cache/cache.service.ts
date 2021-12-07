/**
 * @file Cache enhancer service
 * @module processor/cache/service
 * @author Surmon <https://github.com/surmon-china>
 */

import schedule from 'node-schedule'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { RedisCacheStore } from './cache.store'
import logger from '@app/utils/logger'

export type CacheKey = string
export type CacheResult<T> = Promise<T>

// IO 模式通用返回结构
export interface CacheIOResult<T> {
  get(): CacheResult<T>
  update(): CacheResult<T>
}

// Promise 模式参数
export interface CachePromiseOption<T> {
  key: CacheKey
  promise(): CacheResult<T>
}

// Promise & IO 模式参数
export interface CachePromiseIOOption<T> extends CachePromiseOption<T> {
  ioMode?: boolean
}

// Interval & Timeout 超时模式参数（毫秒）
export interface CacheIntervalTimeoutOption {
  error?: number
  success?: number
}

// Interval & Timing 定时模式参数（毫秒）
export interface CacheIntervalTimingOption {
  error: number
  schedule: any
}

// Interval 模式参数
export interface CacheIntervalOption<T> {
  key: CacheKey
  promise(): CacheResult<T>
  timeout?: CacheIntervalTimeoutOption
  timing?: CacheIntervalTimingOption
}

// Interval 模式返回类型
export type CacheIntervalResult<T> = () => CacheResult<T>

// Interval & IO 模式参数
export interface CacheIntervalIOOption<T> extends CacheIntervalOption<T> {
  ioMode?: boolean
}

/**
 * @class CacheService
 * @classdesc 承载缓存服务
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
      logger.info('[Redis]', 'connecting...')
    })
    this.cacheStore.client.on('reconnecting', () => {
      logger.warn('[Redis]', 'reconnecting...')
    })
    this.cacheStore.client.on('ready', () => {
      this.isReadied = true
      logger.info('[Redis]', 'readied!')
    })
    this.cacheStore.client.on('end', () => {
      this.isReadied = false
      logger.error('[Redis]', 'Client End!')
    })
    this.cacheStore.client.on('error', (error) => {
      this.isReadied = false
      logger.error('[Redis]', `Client Error!`, error.message)
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

  public set(key: CacheKey, value: any, options?: { ttl: number }): CacheResult<void> {
    if (!this.isReadied) {
      return Promise.reject('Redis has not ready!')
    }
    return this.cacheStore.set(key, value, options)
  }

  /**
   * @function promise
   * @description 被动更新 | 双向同步 模式，Promise -> Redis
   * @example CacheService.promise({ key: CacheKey, promise() }) -> promise()
   * @example CacheService.promise({ key: CacheKey, promise(), ioMode: true }) -> { get: promise(), update: promise() }
   */
  promise<T>(options: CachePromiseOption<T>): CacheResult<T>
  promise<T>(options: CachePromiseIOOption<T>): CacheIOResult<T>
  promise(options) {
    const { key, promise, ioMode = false } = options

    // 包装任务
    const doPromiseTask = async () => {
      const data = await promise()
      await this.set(key, data)
      return data
    }

    // Promise 拦截模式（返回死数据）
    const handlePromiseMode = async () => {
      const value = await this.get(key)
      return value !== null && value !== undefined ? value : await doPromiseTask()
    }

    // 双向同步模式（返回获取器和更新器）
    const handleIoMode = () => ({
      get: handlePromiseMode,
      update: doPromiseTask,
    })

    return ioMode ? handleIoMode() : handlePromiseMode()
  }

  /**
   * @function interval
   * @description 定时 | 超时 模式，Promise -> Task -> Redis
   * @example CacheService.interval({ key: CacheKey, promise(), timeout: {} }) -> promise()
   * @example CacheService.interval({ key: CacheKey, promise(), timing: {} }) -> promise()
   */
  public interval<T>(options: CacheIntervalOption<T>): CacheIntervalResult<T>
  public interval<T>(options: CacheIntervalIOOption<T>): CacheIOResult<T>
  public interval<T>(options) {
    const { key, promise, timeout, timing, ioMode = false } = options

    // 包装任务
    const promiseTask = async (): Promise<T> => {
      const data = await promise()
      await this.set(key, data)
      return data
    }

    // 超时任务
    if (timeout) {
      const doPromise = () => {
        promiseTask()
          .then(() => {
            setTimeout(doPromise, timeout.success)
          })
          .catch((error) => {
            const time = timeout.error || timeout.success
            setTimeout(doPromise, time)
            logger.warn('[Redis]', `超时任务执行失败，${time / 1000}s 后重试`, error)
          })
      }
      doPromise()
    }

    // 定时任务
    if (timing) {
      const doPromise = () => {
        promiseTask()
          .then((data) => data)
          .catch((error) => {
            logger.warn('[Redis]', `定时任务执行失败，${timing.error / 1000}s 后重试`, error)
            setTimeout(doPromise, timing.error)
          })
      }
      doPromise()
      schedule.scheduleJob(timing.schedule, doPromise)
    }

    // 获取器
    const getKeyCache = () => this.get(key)

    // 双向同步模式（返回获取器和更新器）
    const handleIoMode = () => ({
      get: getKeyCache,
      update: promiseTask,
    })

    // 返回 Redis 获取器
    return ioMode ? handleIoMode() : getKeyCache
  }
}
