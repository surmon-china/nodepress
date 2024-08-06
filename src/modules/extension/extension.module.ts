/**
 * @file Extension module
 * @module module/extension/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { TagModule } from '@app/modules/tag/tag.module'
import { VoteModule } from '@app/modules/vote/vote.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentModule } from '@app/modules/comment/comment.module'
import { FeedbackModule } from '@app/modules/feedback/feedback.module'
import { ExtensionController } from './extension.controller'
import { StatisticService } from './extension.service.statistic'
import { DBBackupService } from './extension.service.dbbackup'

@Module({
  imports: [TagModule, VoteModule, ArticleModule, CommentModule, FeedbackModule],
  controllers: [ExtensionController],
  providers: [StatisticService, DBBackupService],
  exports: [StatisticService, DBBackupService]
})
export class ExtensionModule {}
