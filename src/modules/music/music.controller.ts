/**
 * Music controller.
 * @file Music 模块控制器
 * @module modules/music/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {

  constructor(private readonly musicService: MusicService) {}

  @Get('list/:list_id')
  @HttpProcessor.handle('获取播放列表')
  getPlaylist(@Param('list_id') listId, @Query('limit') listLimit): Promise<any> {
    return this.musicService.isRequestDefaultList(listId, listLimit)
      ? this.musicService.getMusicListCache()
      : this.musicService.getMusicList(listId, listLimit);
  }

  @Get('song/:song_id')
  @HttpProcessor.handle('获取音乐详情')
  getSong(@Param('song_id') songId): Promise<any> {
    return this.musicService.getMusicSong(songId);
  }

  @Get('url/:song_id')
  @HttpProcessor.handle('获取音乐地址')
  getSongUrl(@Param('song_id') songId): Promise<any> {
    return this.musicService.getMusicUrl(songId);
  }

  @Get('lrc/:song_id')
  @HttpProcessor.handle('获取音乐歌词')
  getSongLrc(@Param('song_id') songId): Promise<any> {
    return this.musicService.getMusicLrc(songId);
  }

  @Get('picture/:picture_id')
  @HttpProcessor.handle('获取音乐封面')
  getSongPicture(@Param('picture_id') pictureId): Promise<any> {
    return this.musicService.getMusicPic(pictureId);
  }
}
