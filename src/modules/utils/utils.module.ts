/**
 * Utils module.
 * @file Utils 模块
 * @module modules/utils/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, HttpModule } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { GithubService } from './github.service';
import { QiniuService } from './qiniu.service';
import { StatisticService } from './statistic.service';

@Module({
  imports: [HttpModule],
  controllers: [UtilsController],
  providers: [GithubService, QiniuService, StatisticService],
  exports: [GithubService, QiniuService, StatisticService],
})
export class UtilsModule {}
