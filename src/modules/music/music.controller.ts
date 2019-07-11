/**
 * Music controller.
 * @file Music 模块控制器
 * @module module/music/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { UseGuards, Controller, Get, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams, EQueryParamsField as QueryField } from '@app/decorators/query-params.decorator';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {

  constructor(private readonly musicService: MusicService) {}

  @Patch('list')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('更新播放列表缓存')
  updateMusicPlaylistCache(): Promise<any> {
    return this.musicService.updateListCache();
  }

  @Get('list/:list_id')
  @HttpProcessor.handle('获取播放列表')
  getMusicPlaylist(@QueryParams([{ [QueryField.ParamsId]: 'list_id' }, 'limit' ]) { querys, params }): Promise<any> {
    return this.musicService.isRequestDefaultList(params.list_id, querys.limit)
      ? this.musicService.getListCache()
      : this.musicService.getList(params.list_id, querys.limit);
  }

  @Get('song/:song_id')
  @HttpProcessor.handle('获取音乐详情')
  getMusicSong(@Param('song_id') songId): Promise<any> {
    return this.musicService.getSong(songId);
  }

  @Get('url/:song_id')
  @HttpProcessor.handle('获取音乐地址')
  getMusicSongUrl(@Param('song_id') songId): Promise<any> {
    return this.musicService.getUrl(songId);
  }

  @Get('lrc/:song_id')
  @HttpProcessor.handle('获取音乐歌词')
  getMusicSongLrc(@Param('song_id') songId): Promise<any> {
    return this.musicService.getLrc(songId);
  }

  @Get('picture/:picture_id')
  @HttpProcessor.handle('获取音乐封面')
  getMusicSongPicture(@Param('picture_id') pictureId): Promise<any> {
    return this.musicService.getPic(pictureId);
  }
}
