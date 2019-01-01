/**
 * Extended module.
 * @file Extended 模块
 * @module modules/extended/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, HttpModule } from '@nestjs/common';
import { ExtendedController } from './extended.controller';
import { GithubService } from './extended.service.github';
import { QiniuService } from './extended.service.qiniu';
import { StatisticService } from './extended.service.statistic';

@Module({
  imports: [HttpModule],
  controllers: [ExtendedController],
  providers: [GithubService, QiniuService, StatisticService],
  exports: [GithubService, QiniuService, StatisticService],
})
export class ExtendedModule {}
