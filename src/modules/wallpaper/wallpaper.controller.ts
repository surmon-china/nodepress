/**
 * Wallpaper controller.
 * @file Wallpaper 模块控制器
 * @module module/wallpaper/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { WallpaperService } from './wallpaper.service';

@Controller('wallpaper')
export class WallpaperController {

  constructor(private readonly wallpaperService: WallpaperService) {}

  @Get('list')
  @HttpProcessor.handle('获取今日壁纸列表')
  getWallpapers(): Promise<any> {
    return this.wallpaperService.getWallpapersCache();
  }
}
