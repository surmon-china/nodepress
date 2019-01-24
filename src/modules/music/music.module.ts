/**
 * Music module.
 * @file Music 模块
 * @module module/music/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';

@Module({
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
