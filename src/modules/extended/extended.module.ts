/**
 * Extended module.
 * @file Extended 模块
 * @module module/extended/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { TypegooseModule } from 'nestjs-typegoose';
import { Module, HttpModule } from '@nestjs/common';
import { ExtendedController } from './extended.controller';
import { GithubService } from './extended.service.github';
import { QiniuService } from './extended.service.qiniu';
import { StatisticService } from './extended.service.statistic';
import { Article } from '@app/modules/article/article.model';
import { Comment } from '@app/modules/comment/comment.model';

@Module({
  imports: [
    HttpModule,
    TypegooseModule.forFeature(Article),
    TypegooseModule.forFeature(Comment),
  ],
  controllers: [ExtendedController],
  providers: [GithubService, QiniuService, StatisticService],
  exports: [GithubService, QiniuService, StatisticService],
})
export class ExtendedModule {}
