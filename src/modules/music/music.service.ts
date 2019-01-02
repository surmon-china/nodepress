/**
 * Music service.
 * @file Music 模块服务
 * @module module/music/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as lodash from 'lodash';
import * as NeteseMusic from 'simple-netease-cloud-music';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { Injectable } from '@nestjs/common';
import { CacheService, ICacheIntervalResult } from '@app/processors/cache/cache.service';

@Injectable()
export class MusicService {

  // 默认参数
  defaultListLimit = 30;
  defaultListId = '638949385';

  // 音乐服务
  private neteseMusic: NeteseMusic;
  private musicListCache: ICacheIntervalResult;

  constructor(private readonly cacheService: CacheService) {
    // 音乐服务实例
    this.neteseMusic = new NeteseMusic();
    // 音乐列表缓存器
    this.musicListCache = this.cacheService.interval({
      key: CACHE_KEY.MUSIC_LIST_PREFIX + this.defaultListId,
      promise: () => this.getMusicList(this.defaultListId, this.defaultListLimit),
      timeout: {
        success: 1000 * 60 * 30, // 成功后 30分钟 获取数据
        error: 1000 * 60 * 5, // 失败后 5分钟 获取数据
      },
    });
  }

  // 获取播放列表缓存
  getMusicListCache() {
    return this.musicListCache();
  }

  // 是否获取默认列表
  isRequestDefaultList(listId, listLimit): boolean {
    const isHitDefaultListId = listId === this.defaultListId;
    const isHitDefaultListLimit = listLimit === this.defaultListLimit || lodash.isUndefined(listLimit);
    return isHitDefaultListId && isHitDefaultListLimit;
  }

  // 获取歌单列表
  getMusicList(listId, listLimit) {
    return this.neteseMusic._playlist(listId).then(({ playlist }) => {
      Reflect.deleteProperty(playlist, 'trackIds');
      playlist.tracks = playlist.tracks.slice(0, listLimit);
      return playlist;
    });
  }

  getMusicSong(songId): Promise<any> {
    return this.neteseMusic.song(songId);
  }

  getMusicUrl(songId): Promise<any> {
    return this.neteseMusic.url(songId, 128);
  }

  getMusicLrc(songId): Promise<any> {
    return this.neteseMusic.lyric(songId);
  }

  getMusicPic(picId): Promise<any> {
    return this.neteseMusic.picture(picId, 700);
  }
}
