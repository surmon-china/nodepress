/**
 * @file Vote module
 * @module module/vote/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { OptionModule } from '@app/modules/option/option.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentModule } from '@app/modules/comment/comment.module'
import { DisqusModule } from '@app/modules/disqus/disqus.module'
import { VoteController } from './vote.controller'

@Module({
  imports: [OptionModule, ArticleModule, CommentModule, DisqusModule],
  controllers: [VoteController],
})
export class VoteModule {}
