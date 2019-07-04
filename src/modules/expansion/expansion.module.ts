/**
 * Expansion module.
 * @file Expansion 模块
 * @module module/expansion/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { TypegooseModule } from 'nestjs-typegoose';
import { Module, HttpModule } from '@nestjs/common';
import { ExpansionController } from './expansion.controller';
import { GithubService } from './expansion.service.github';
import { QiniuService } from './expansion.service.qiniu';
import { StatisticService } from './expansion.service.statistic';
import { Article } from '@app/modules/article/article.model';
import { Comment } from '@app/modules/comment/comment.model';

@Module({
  imports: [
    HttpModule,
    TypegooseModule.forFeature([Article, Comment]),
    // TypegooseModule.forFeature(Comment),
  ],
  controllers: [ExpansionController],
  providers: [GithubService, QiniuService, StatisticService],
  exports: [GithubService, QiniuService, StatisticService],
})
export class ExpansionModule {}
