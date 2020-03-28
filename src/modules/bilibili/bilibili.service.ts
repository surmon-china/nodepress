/**
 * Bilibili service.
 * @file Bilibili 模块服务
 * @module module/bilibili/service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash';
import { Injectable, HttpService } from '@nestjs/common';
import { CacheService, ICacheIoResult } from '@app/processors/cache/cache.service';
import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';

// B 站视频列表格式
export interface IBilibiliVideoList {
  status: boolean;
  data: any;
  vlist: any[];
}

@Injectable()
export class BilibiliService {

  private uid = 27940710;
  private keyword = 'vlog';
  private defaultPageSize = 66;
  private defaultPage = 1;
  private videoListCache: ICacheIoResult<IBilibiliVideoList>;

  constructor(private readonly httpService: HttpService, private readonly cacheService: CacheService) {
    this.videoListCache = this.cacheService.interval({
      ioMode: true,
      key: CACHE_KEY.BILIBILI_LIST,
      promise: () => this.getVideoList(this.defaultPageSize, this.defaultPage),
      timeout: {
        success: 1000 * 60 * 30, // 成功后 30 分钟更新一次数据
        error: 1000 * 60 * 5, // 失败后 5 分钟更新一次数据
      },
    });
  }

  // 是否获取默认列表
  public isRequestDefaultList(pageSize?: string | number, page?: string | number): boolean {
    const isHitDefaultPageSize = pageSize === this.defaultPageSize || lodash.isUndefined(pageSize);
    const isHitDefaultPage = page === this.defaultPage || lodash.isUndefined(page);
    return isHitDefaultPageSize && isHitDefaultPage;
  }

  // 获取缓存
  public getVideoListCache(): Promise<IBilibiliVideoList> {
    return this.videoListCache.get();
  }

  // 更新缓存
  public updateVideoListCache(): Promise<IBilibiliVideoList> {
    return this.videoListCache.update();
  }

  // 获取项目列表
  public getVideoList(pageSize?: string | number, page?: string | number): Promise<IBilibiliVideoList> {

    page = page || this.defaultPage;
    pageSize = pageSize || this.defaultPageSize;

    return this.httpService.axiosRef
      .request<IBilibiliVideoList>({
        headers: { 'User-Agent': APP_CONFIG.INFO.name },
        url: `https://space.bilibili.com/ajax/member/getSubmitVideos?mid=${this.uid}&pagesize=${pageSize}&page=${page}&keyword=${this.keyword}&order=pubdate`,
      })
      .then(videosResult => {
        if (videosResult.data.status) {
          return Promise.resolve(videosResult.data.data);
        } else {
          return Promise.reject(videosResult.status + videosResult.statusText);
        }
      });
  }
}
