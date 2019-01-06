/**
 * Wallpaper controller.
 * @file Wallpaper 模块控制器
 * @module module/wallpaper/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get } from '@nestjs/common';
import { WallpaperService } from './wallpaper.service';
import { HttpProcessor } from '@app/decorators/http.decorator';

@Controller('wallpaper')
export class WallpaperController {

  constructor(private readonly wallpaperService: WallpaperService) {}

  @Get('list')
  @HttpProcessor.handle('获取今日壁纸列表')
  getWallpapers(): Promise<any> {
    return this.wallpaperService.getWallpapersCache();
  }

  @Get('story')
  @HttpProcessor.handle('获取今日壁纸故事')
  getWallpaperStory(): Promise<any> {
    return this.wallpaperService.getStoryCache();
  }
}
