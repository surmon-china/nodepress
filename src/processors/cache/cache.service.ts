/**
 * @file Cache enhancer service
 * @module processor/cache/service
 * @author Surmon <https://github.com/surmon-china>
 */

import schedule from 'node-schedule'
import { Injectable } from '@nestjs/common'
import { isNil } from '@app/constants/value.constant'
import { RedisService } from './redis.service'
import logger from '@app/utils/logger'

const log = logger.scope('CacheService')

export interface CacheBaseOptions<T> {
  key: string
  promise(): Promise<T>
}

export interface CacheManualResult<T> {
  get(): Promise<T>
  update(): Promise<T>
}

export interface CacheIntervalOptions<T> extends CacheBaseOptions<T> {
  interval: number
  retry: number
}

export interface CacheScheduleOptions<T> extends CacheBaseOptions<T> {
  schedule: string | number | Date
  retry: number
}

/**
 * @class CacheService
 * @classdesc Global cache service
 * @example CacheService.get(CacheKey).then()
 * @example CacheService.set(CacheKey).then()
 * @example CacheService.delete(CacheKey).then()
 * @example CacheService.once({ option })
 * @example CacheService.manual({ option }).get()
 * @example CacheService.interval({ option })()
 * @example CacheService.schedule({ option })()
 */
@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  public set(
    key: string,
    value: any,
    /** seconds */
    ttl?: number
  ): Promise<void> {
    return this.redisService.store.set(key, value, ttl)
  }

  public get<T>(key: string): Promise<T> {
    return this.redisService.store.get<T>(key) as Promise<T>
  }

  public delete(key: string): Promise<void> {
    return this.redisService.store.delete(key)
  }

  /** Execute the Promise and store the data into the cache. */
  private async execPromise<T>(options: CacheBaseOptions<T>): Promise<T> {
    const data = await options.promise()
    await this.set(options.key, data)
    return data
  }

  /**
   * @function once
   * @description Store data into the cache only once, and always get data from the cache afterwards.
   * @example CacheService.once({ ... }) -> promise()
   */
  public async once<T>(options: CacheBaseOptions<T>): Promise<T> {
    const data = await this.get<T>(options.key)
    return isNil(data) ? await this.execPromise<T>(options) : data
  }

  /**
   * @function manual
   * @description Always need to `get` and `update` the cache manually, if the cache doesn't exist it will do the `CacheService.once` logic itself.
   * @example CacheService.manual({ ... }) -> { get: promise(), update: promise() }
   */
  public manual<T>(options: CacheBaseOptions<T>): CacheManualResult<T> {
    return {
      get: () => this.once<T>(options),
      update: () => this.execPromise<T>(options)
    }
  }

  /**
   * @function interval
   * @description By controlling cache updates through time intervals, you can also control the retry time after a failed data fetch.
   * @example CacheService.interval({ ... }) -> () => promise()
   */
  public interval<T>(options: CacheIntervalOptions<T>): () => Promise<T> {
    const execIntervalTask = () => {
      this.execPromise(options)
        .then(() => {
          setTimeout(execIntervalTask, options.interval)
        })
        .catch((error) => {
          setTimeout(execIntervalTask, options.retry)
          log.warn(`interval task failed! retry when after ${options.retry / 1000}s,`, error)
        })
    }

    execIntervalTask()
    return () => this.get(options.key)
  }

  /**
   * @function schedule
   * @description Using schedule to control cache updates, you can also control the retry time after a failed data fetch.
   * @example CacheService.schedule({ ... }) -> () => promise()
   */
  public schedule<T>(options: CacheScheduleOptions<T>): () => Promise<T> {
    const execScheduleTask = () => {
      this.execPromise(options).catch((error) => {
        log.warn(`schedule task failed! retry when after ${options.retry / 1000}s,`, error)
        setTimeout(execScheduleTask, options.retry)
      })
    }

    execScheduleTask()
    schedule.scheduleJob(options.schedule, execScheduleTask)
    return () => this.get(options.key)
  }
}
