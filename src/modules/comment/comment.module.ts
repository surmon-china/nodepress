/**
 * Comment module.
 * @file 评论模块
 * @module module/comment/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SitemapModule } from '@app/modules/sitemap/sitemap.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.model';
import { Option } from '@app/modules/option/option.model';
import { Article } from '@app/modules/article/article.model';

@Module({
  imports: [
    TypegooseModule.forFeature([Option, Article, Comment]),
    // TypegooseModule.forFeature([Article]),
    // TypegooseModule.forFeature([Comment]),
    SitemapModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
