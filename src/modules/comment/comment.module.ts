/**
 * @file Comment module
 * @module module/comment/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { OptionsModule } from '@app/modules/options/options.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentController } from './comment.controller'
import { CommentProvider } from './comment.model'
import { CommentService } from './comment.service'
import { CommentListener } from './comment.listener'

@Module({
  imports: [OptionsModule, ArticleModule],
  controllers: [CommentController],
  providers: [CommentProvider, CommentService, CommentListener],
  exports: [CommentService]
})
export class CommentModule {}
