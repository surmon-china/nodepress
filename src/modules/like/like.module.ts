/**
 * Like module.
 * @file 点赞模块
 * @module module/like/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { Option } from '@app/modules/option/option.model';
import { Article } from '@app/modules/article/article.model';
import { Comment } from '@app/modules/comment/comment.model';

@Module({
  imports: [
    TypegooseModule.forFeature(Option),
    TypegooseModule.forFeature(Article),
    TypegooseModule.forFeature(Comment),
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
