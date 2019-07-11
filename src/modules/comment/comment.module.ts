/**
 * Comment module.
 * @file 评论模块
 * @module module/comment/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { SitemapModule } from '@app/modules/sitemap/sitemap.module';
import { OptionProvider } from '@app/modules/option/option.model';
import { ArticleProvider } from '@app/modules/article/article.model';
import { CommentController } from './comment.controller';
import { CommentProvider } from './comment.model';
import { CommentService } from './comment.service';

@Module({
  imports: [SitemapModule],
  controllers: [CommentController],
  providers: [
    CommentProvider,
    ArticleProvider,
    OptionProvider,
    CommentService,
  ],
  exports: [CommentService],
})
export class CommentModule {}
