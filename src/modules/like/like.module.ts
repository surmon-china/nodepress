/**
 * Like module.
 * @file 点赞模块
 * @module module/like/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { OptionModule } from '@app/modules/option/option.module';
import { ArticleModule } from '@app/modules/article/article.module';
import { CommentModule } from '@app/modules/comment/comment.module';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports: [OptionModule, ArticleModule, CommentModule],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
