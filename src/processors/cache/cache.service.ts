/**
 * Cache service.
 * @file Cache 缓存模块服务
 * @module processor/cache/service
 * @author Surmon <https://github.com/surmon-china>
 */

import schedule from 'node-schedule';
import { RedisClient } from 'redis';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

// Cache 客户端管理器
export interface ICacheManager {
  store: {
    getClient(): RedisClient;
  };
  get(key: TCacheKey): any;
  set(key: TCacheKey, value: string, options?: { ttl: number }): any;
}

// 获取器
export type TCacheKey = string;
export type TCacheResult<T> = Promise<T>;

// IO 模式通用返回结构
export interface ICacheIoResult<T> {
  get(): TCacheResult<T>;
  update(): TCacheResult<T>;
}

// Promise 模式参数
export interface ICachePromiseOption<T> {
  key: TCacheKey;
  promise(): TCacheResult<T>;
}

// Promise & IO 模式参数
export interface ICachePromiseIoOption<T> extends ICachePromiseOption<T> {
  ioMode?: boolean;
}

// Interval & Timeout 超时模式参数（毫秒）
export interface ICacheIntervalTimeoutOption {
  error?: number;
  success?: number;
}

// Interval & Timing 定时模式参数（毫秒）
export interface ICacheIntervalTimingOption {
  error: number;
  schedule: any;
}

// Interval 模式参数
export interface ICacheIntervalOption<T> {
  key: TCacheKey;
  promise(): TCacheResult<T>;
  timeout?: ICacheIntervalTimeoutOption;
  timing?: ICacheIntervalTimingOption;
}

// Interval 模式返回类型
export type TCacheIntervalResult<T> = () => TCacheResult<T>;

// Interval & IO 模式参数
export interface ICacheIntervalIOOption<T> extends ICacheIntervalOption<T> {
  ioMode?: boolean;
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

  private cache!: ICacheManager;

  constructor(@Inject(CACHE_MANAGER) cache: ICacheManager) {
    this.cache = cache;
    this.redisClient.on('ready', () => {
      console.info('Redis 已准备好！');
    });
  }

  private get redisClient(): RedisClient {
    return this.cache.store.getClient();
  }

  // 客户端是否可用
  private get checkCacheServiceAvailable(): boolean {
    return this.redisClient.connected;
  }

  public get<T>(key: TCacheKey): TCacheResult<T> {
    if (!this.checkCacheServiceAvailable) {
      return Promise.reject('缓存客户端没准备好！');
    }
    return this.cache.get(key);
  }

  public set<T>(key: TCacheKey, value: any, options?: { ttl: number }): TCacheResult<T> {
    if (!this.checkCacheServiceAvailable) {
      return Promise.reject('缓存客户端没准备好！');
    }
    return this.cache.set(key, value, options);
  }

  /**
   * @function promise
   * @description 被动更新 | 双向同步 模式，Promise -> Redis
   * @example CacheService.promise({ key: CacheKey, promise() }) -> promise()
   * @example CacheService.promise({ key: CacheKey, promise(), ioMode: true }) -> { get: promise(), update: promise() }
   */
  promise<T>(options: ICachePromiseOption<T>): TCacheResult<T>;
  promise<T>(options: ICachePromiseIoOption<T>): ICacheIoResult<T>;
  promise(options) {

    const { key, promise, ioMode = false } = options;

    // 包装任务
    const doPromiseTask = () => {
      return promise().then(data => {
        this.set(key, data);
        return data;
      })
    };

    // Promise 拦截模式（返回死数据）
    const handlePromiseMode = () => {
      return this.get(key).then(value => {
        return value !== null && value !== undefined
          ? value
          : doPromiseTask();
      })
    };

    // 双向同步模式（返回获取器和更新器）
    const handleIoMode = () => ({
      get: handlePromiseMode,
      update: doPromiseTask
    });

    return ioMode ? handleIoMode() : handlePromiseMode();
  }

  /**
   * @function interval
   * @description 定时 | 超时 模式，Promise -> Task -> Redis
   * @example CacheService.interval({ key: CacheKey, promise(), timeout: {} }) -> promise()
   * @example CacheService.interval({ key: CacheKey, promise(), timing: {} }) -> promise()
   */
  public interval<T>(options: ICacheIntervalOption<T>): TCacheIntervalResult<T>;
  public interval<T>(options: ICacheIntervalIOOption<T>): ICacheIoResult<T>;
  public interval<T>(options) {

    const { key, promise, timeout, timing, ioMode = false } = options;

    // 包装任务
    const promiseTask = (): Promise<T> => {
      return promise().then(data => {
        this.set(key, data);
        return data;
      });
    };

    // 超时任务
    if (timeout) {
      const doPromise = () => {
        promiseTask()
          .then(() => {
            setTimeout(doPromise, timeout.success);
          })
          .catch(error => {
            const time = timeout.error || timeout.success;
            setTimeout(doPromise, time);
            console.warn(`Redis 超时任务执行失败，${time / 1000}s 后重试：${error}`);
          });
      };
      doPromise();
    }

    // 定时任务
    if (timing) {
      const doPromise = () => {
        promiseTask()
          .then(data => data)
          .catch(error => {
            console.warn(`Redis 定时任务执行失败，${timing.error / 1000}s 后重试：${error}`);
            setTimeout(doPromise, timing.error);
          });
      };
      doPromise();
      schedule.scheduleJob(timing.schedule, doPromise);
    }

    // 获取器
    const getKeyCache = () => this.get(key);

    // 双向同步模式（返回获取器和更新器）
    const handleIoMode = () => ({
      get: getKeyCache,
      update: promiseTask,
    });

    // 返回 Redis 获取器
    return ioMode ? handleIoMode() : getKeyCache;
  }
}
