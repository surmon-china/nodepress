/**
 * Like controller.
 * @file 点赞模块控制器
 * @module module/like/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { Controller, Patch, Body } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { Option } from '@app/modules/option/option.model';
import { Article } from '@app/modules/article/article.model';
import { Comment } from '@app/modules/comment/comment.model';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Patch('site')
  @HttpProcessor.handle('爱你么么扎！喜欢主站')
  likeSite(): Promise<Option> {
    return this.likeService.likeSite();
  }

  @Patch('comment')
  @HttpProcessor.handle('爱你么么扎！点赞评论')
  likeComment(@Body('id') commentId: Types.ObjectId): Promise<Article> {
    return this.likeService.likeComment(commentId);
  }

  @Patch('article')
  @HttpProcessor.handle('爱你么么扎！点赞文章')
  likeArticle(@Body('id') articleId: Types.ObjectId): Promise<Comment> {
    return this.likeService.likeArticle(articleId);
  }
}
