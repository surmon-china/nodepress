/**
 * @file Comment module
 * @module module/comment/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { OptionsModule } from '@app/modules/options/options.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { UserModule } from '@app/modules/user/user.module'
import { CommentController } from './comment.controller'
import { CommentProvider } from './comment.model'
import { CommentAkismetService } from './comment.service.akismet'
import { CommentBlocklistService } from './comment.service.blocklist'
import { CommentEffectService } from './comment.service.effect'
import { CommentStatsService } from './comment.service.stats'
import { CommentService } from './comment.service'
import { CommentListener } from './comment.listener'

@Module({
  imports: [OptionsModule, ArticleModule, UserModule],
  controllers: [CommentController],
  providers: [
    CommentProvider,
    CommentAkismetService,
    CommentBlocklistService,
    CommentEffectService,
    CommentStatsService,
    CommentService,
    CommentListener
  ],
  exports: [CommentService, CommentStatsService]
})
export class CommentModule {}
