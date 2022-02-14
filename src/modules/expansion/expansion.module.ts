/**
 * @file Expansion module
 * @module module/expansion/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { TagModule } from '@app/modules/tag/tag.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentModule } from '@app/modules/comment/comment.module'
import { ExpansionController } from './expansion.controller'
import { StatisticService } from './expansion.service.statistic'
import { DBBackupService } from './expansion.service.dbbackup'

@Module({
  imports: [TagModule, ArticleModule, CommentModule],
  controllers: [ExpansionController],
  providers: [StatisticService, DBBackupService],
  exports: [StatisticService, DBBackupService],
})
export class ExpansionModule {}
