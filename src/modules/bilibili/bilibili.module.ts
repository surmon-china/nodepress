/**
 * Bilibili module.
 * @file Bilibili 模块
 * @module module/bilibili/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, HttpModule } from '@nestjs/common';
import { BilibiliController } from './bilibili.controller';
import { BilibiliService } from './bilibili.service';

@Module({
  imports: [HttpModule],
  controllers: [BilibiliController],
  providers: [BilibiliService],
  exports: [BilibiliService],
})
export class BilibiliModule {}
