/**
 * Extended module.
 * @file Extended 模块
 * @module modules/extended/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, HttpModule } from '@nestjs/common';
import { ExtendedController } from './extended.controller';
import { GithubService } from './extended.github.service';
import { QiniuService } from './extended.qiniu.service';
import { StatisticService } from './extended.statistic.service';

@Module({
  imports: [HttpModule],
  controllers: [ExtendedController],
  providers: [GithubService, QiniuService, StatisticService],
  exports: [GithubService, QiniuService, StatisticService],
})
export class ExtendedModule {}
