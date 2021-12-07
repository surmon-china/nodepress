/**
 * @file Comment module
 * @module module/comment/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { OptionModule } from '@app/modules/option/option.module'
import { ArticleProvider } from '@app/modules/article/article.model'
import { CommentController } from './comment.controller'
import { CommentProvider } from './comment.model'
import { CommentService } from './comment.service'

@Module({
  imports: [OptionModule],
  controllers: [CommentController],
  providers: [CommentProvider, ArticleProvider, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
