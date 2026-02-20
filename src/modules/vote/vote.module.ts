/**
 * @file Vote module
 * @module module/vote/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { UserModule } from '@app/modules/user/user.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentModule } from '@app/modules/comment/comment.module'
import { VoteProvider } from './vote.model'
import { VoteService } from './vote.service'
import { VoteListener } from './vote.listener'
import { VoteController } from './vote.controller'

@Module({
  imports: [UserModule, ArticleModule, CommentModule],
  controllers: [VoteController],
  providers: [VoteProvider, VoteService, VoteListener],
  exports: [VoteService]
})
export class VoteModule {}
