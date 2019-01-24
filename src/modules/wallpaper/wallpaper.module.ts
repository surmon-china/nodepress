/**
 * Wallpaper module.
 * @file Wallpaper 模块
 * @module module/wallpaper/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { WallpaperController } from './wallpaper.controller';
import { WallpaperService } from './wallpaper.service';

@Module({
  controllers: [WallpaperController],
  providers: [WallpaperService],
  exports: [WallpaperService],
})
export class WallpaperModule {}
