/**
 * Wallpaper service.
 * @file Wallpaper 模块服务
 * @module module/wallpaper/service
 * @author Surmon <https://github.com/surmon-china>
 */

import WonderfulBingWallpaper, { WonderfulBingWallpaperOption } from 'wonderful-bing-wallpaper';
import { Injectable } from '@nestjs/common';
import { CacheService, TCacheIntervalResult, ICacheIntervalTimingOption } from '@app/processors/cache/cache.service';
import * as CACHE_KEY from '@app/constants/cache.constant';

@Injectable()
export class WallpaperService {

  private wbw: WonderfulBingWallpaper;
  private zhWallpapersCache: TCacheIntervalResult<any>;
  private enWallpapersCache: TCacheIntervalResult<any>;

  // 通用定时配置
  private commonTimingConfig: ICacheIntervalTimingOption = {
    schedule: '10 0 0 * * *', // 默认每天的 0:00:10 获取数据
    error: 10 * 60 * 1000, // 如果获取失败则 10 分钟后重新获取一次
  };

  constructor(private readonly cacheService: CacheService) {
    // 壁纸服务实例
    this.wbw = new WonderfulBingWallpaper();
    // 今日壁纸缓存器（ZH）
    this.zhWallpapersCache = this.cacheService.interval({
      key: CACHE_KEY.WALLPAPERS + 'ZH',
      timing: this.commonTimingConfig,
      promise: () => {
        return this.getWallpapers({
          local: 'zh-CN',
          host: 'cn.bing.com',
          ensearch: 0
        })
      }
    });
    // 今日壁纸缓存器（EN）
    this.enWallpapersCache = this.cacheService.interval({
      key: CACHE_KEY.WALLPAPERS + 'EN',
      timing: this.commonTimingConfig,
      promise: () => {
        return this.getWallpapers({
          local: 'en-US',
          host: 'bing.com',
          ensearch: 1
        })
      }
    });
  }

  // 今日壁纸缓存（ZH）
  public getZhWallpapersCache(): Promise<any> {
    return this.zhWallpapersCache();
  }

  // 今日壁纸缓存（EN）
  public getEnWallpapersCache(): Promise<any> {
    return this.enWallpapersCache();
  }

  // 获取今日壁纸
  public getWallpapers(params?: WonderfulBingWallpaperOption): Promise<any> {
    return this.wbw
      .getWallpapers({ ...params, size: 8 })
      .then(wallpaperJSON => {
        try {
          return Promise.resolve(
            this.wbw.humanizeWallpapers(wallpaperJSON),
          );
        } catch (error) {
          return Promise.reject('wallpaper 控制器解析 JSON 失败' + error);
        }
      })
      .catch(error => {
        console.warn('获取今日壁纸出现了问题', error);
        return Promise.reject(error);
      });
  }
}
