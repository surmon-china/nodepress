import console from 'console';
import schedule from 'schedule';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

type TCacheKey = string;
type TCacheResult = Promise<any>;

export interface ICacheManager {
  store: any;
  get(key: TCacheKey): any;
  set(key: TCacheKey, value: string, options?: { ttl: number }): any;
}

export interface ICachePromiseOption {
  key: TCacheKey;
  ioMode?: boolean;
  promise();
}

export type TCachePromiseResult = TCacheResult | {
  get();
  update()
};

interface ICacheIntervalOption {
  key: TCacheKey;
  promise();
  timeout?: {
    error?: number;
    success?: number;
  };
  timing?: {
    error: number;
    schedule: any;
  };
}

export type ICacheIntervalResult = () => void;

@Injectable()
export class CacheService {
  private cache!: ICacheManager;

  constructor(@Inject(CACHE_MANAGER) cache: ICacheManager) {
    this.cache = cache;
  }

  public get(key: TCacheKey): TCacheResult {
    return this.cache.get(key);
  }

  public set(key: TCacheKey, value: any, options?: { ttl: number }): TCacheResult {
    return this.cache.set(key, value, options);
  }

  // promise -> redis
  public promise(options: ICachePromiseOption): TCachePromiseResult {

    const { key, promise, ioMode = false } = options;

    // 执行任务
    const doPromise = (resolve, reject) => {
      return promise().then(data => {
        this.set(key, data);
        resolve(data);
      }).catch(reject);
    };

    // Promise 拦截模式（返回死数据）
    const handlePromiseMode = () => {
      return new Promise((resolve, reject) => {
        this.get(key).then(value => {
          const isValidValue = value !== null && value !== undefined;
          isValidValue ? resolve(value) : doPromise(resolve, reject);
        }).catch(reject);
      });
    };

    // 双向同步模式（返回获取器和更新器）
    const handleIoMode = () => ({
      get: handlePromiseMode,
      update: () => new Promise(doPromise),
    });

    return ioMode ? handleIoMode() : handlePromiseMode();
  }

  // 定时或间隔时间
  public interval(options: ICacheIntervalOption): ICacheIntervalResult {

    const { key, promise, timeout, timing } = options;

    // 超时任务
    if (timeout) {
      const promiseTask = () => {
        promise().then(data => {
          this.set(key, data);
          setTimeout(promiseTask, timeout.success);
        }).catch(error => {
          const time = timeout.error || timeout.success;
          setTimeout(promiseTask, time);
          console.warn(`Redis 超时任务执行失败，${time} 后重试：${error}`);
        });
      };
      promiseTask();
    }

    // 定时任务
    if (timing) {
      const promiseTask = () => {
        promise()
          .then(data => this.set(key, data))
          .catch(error => {
            console.warn(`Redis 定时任务执行失败，${timing.error} 后重试：${error}`);
            setTimeout(promiseTask, timing.error);
          });
      };
      promiseTask();
      schedule.scheduleJob(timing.schedule, promiseTask);
    }

    // 返回 Redis 获取器
    return () => this.get(key);
  }
}
