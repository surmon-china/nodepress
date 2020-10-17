/**
 * Music service.
 * @file Music 模块服务
 * @module module/music/service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash';
import NeteaseMusic from 'simple-netease-cloud-music';
import { Injectable } from '@nestjs/common';
import { CacheService, ICacheIoResult } from '@app/processors/cache/cache.service';
import * as CACHE_KEY from '@app/constants/cache.constant';

@Injectable()
export class MusicService {

  // 默认参数
  private defaultListLimit = 30;
  private defaultListId = '638949385';

  // 音乐服务
  private neteseMusic: NeteaseMusic;
  private listCache: ICacheIoResult<any>;

  constructor(private readonly cacheService: CacheService) {
    // 音乐服务实例
    this.neteseMusic = new NeteaseMusic();
    // 音乐列表缓存器
    this.listCache = this.cacheService.interval({
      ioMode: true,
      key: CACHE_KEY.MUSIC_LIST_PREFIX + this.defaultListId,
      promise: () => this.getList(this.defaultListId, this.defaultListLimit),
      timeout: {
        success: 1000 * 60 * 30, // 成功后 30分钟 获取数据
        error: 1000 * 60 * 5, // 失败后 5分钟 获取数据
      },
    });
  }

  // 是否获取默认列表
  public isRequestDefaultList(listId, listLimit): boolean {
    const isHitDefaultListId = String(listId) === this.defaultListId;
    const isHitDefaultListLimit = listLimit === this.defaultListLimit || lodash.isUndefined(listLimit);
    return isHitDefaultListId && isHitDefaultListLimit;
  }

  // 获取播放列表缓存
  public getListCache(): Promise<any> {
    return this.listCache.get();
  }

  // 更新播放列表缓存
  public updateListCache(): Promise<any> {
    return this.listCache.update();
  }

  // 获取歌单列表
  public async getList(listId, listLimit) {
    const { playlist } = await this.neteseMusic._playlist(listId);
    Reflect.deleteProperty(playlist, 'trackIds');
    playlist.tracks = playlist.tracks.slice(0, listLimit);
    return playlist;
  }

  public getSong(songId): Promise<any> {
    return this.neteseMusic.song(songId);
  }

  public getUrl(songId): Promise<any> {
    return this.neteseMusic.url(songId, 128);
  }

  public getLrc(songId): Promise<any> {
    return this.neteseMusic.lyric(songId);
  }

  public getPic(picId): Promise<any> {
    return this.neteseMusic.picture(picId, 700);
  }
}
