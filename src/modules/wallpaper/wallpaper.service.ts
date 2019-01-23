/**
 * Wallpaper service.
 * @file Wallpaper 模块服务
 * @module module/wallpaper/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as CACHE_KEY from '@app/constants/cache.constant';
import * as WonderfulBingWallpaper from 'wonderful-bing-wallpaper';
import { Injectable } from '@nestjs/common';
import { CacheService, TCacheIntervalResult, ICacheIntervalTimingOption } from '@app/processors/cache/cache.service';

@Injectable()
export class WallpaperService {

  private wbw: WonderfulBingWallpaper;
  private storyCache: TCacheIntervalResult<any>;
  private wallpapersCache: TCacheIntervalResult<any>;

  // 通用定时配置
  private commonTimingConfig: ICacheIntervalTimingOption = {
    schedule: '10 0 0 * * *', // 默认每天的 0:00:10 获取数据
    error: 7 * 24 * 60 * 60 * 1000, // 如果获取失败则一分钟后重新获取一次（都挂了，那就先一个月一次吧）
  };

  constructor(private readonly cacheService: CacheService) {
    // 壁纸服务实例
    this.wbw = new WonderfulBingWallpaper({ local: 'zh-CN', host: 'cn.bing.com' });
    // 今日壁纸缓存器
    this.wallpapersCache = this.cacheService.interval({
      key: CACHE_KEY.WALLPAPERS,
      timing: this.commonTimingConfig,
      promise: this.getWallpapers.bind(this),
    });
    // 今日壁纸故事缓存器
    this.storyCache = this.cacheService.interval({
      key: CACHE_KEY.WALLPAPER_STORY,
      timing: this.commonTimingConfig,
      promise: this.wbw.getTodayWallpaperStory.bind(this.wbw),
    });
  }

  // 今日壁纸故事缓存
  public getStoryCache(): Promise<any> {
    return this.storyCache();
  }

  // 今日壁纸缓存
  public getWallpapersCache(): Promise<any> {
    return this.wallpapersCache();
  }

  // 获取今日壁纸
  public getWallpapers(): Promise<any> {
    return this.wbw.getWallpapers({ size: 8 }).then(wallpaperJSON => {
      try {
        const wallpapers = this.wbw.humanizeWallpapers(wallpaperJSON);
        return Promise.resolve(wallpapers);
      } catch (error) {
        return Promise.reject('wallpaper 控制器解析 JSON 失败' + error);
      }
    }).catch(error => {
      console.warn('获取今日壁纸出现了问题', error);
      return Promise.reject(error);
    });
  }
}
