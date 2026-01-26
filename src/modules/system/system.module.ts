/**
 * @file System module
 * @module module/system/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { TagModule } from '@app/modules/tag/tag.module'
import { VoteModule } from '@app/modules/vote/vote.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentModule } from '@app/modules/comment/comment.module'
import { FeedbackModule } from '@app/modules/feedback/feedback.module'
import { SystemController } from './system.controller'
import { StatisticsService } from './system.service.statistics'
import { DBBackupService } from './system.service.dbbackup'

@Module({
  imports: [TagModule, VoteModule, ArticleModule, CommentModule, FeedbackModule],
  controllers: [SystemController],
  providers: [StatisticsService, DBBackupService],
  exports: [StatisticsService, DBBackupService]
})
export class SystemModule {}
