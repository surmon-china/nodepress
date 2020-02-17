/**
 * Like controller.
 * @file 点赞模块控制器
 * @module module/like/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop } from '@typegoose/typegoose';
import { IsInt, IsDefined } from 'class-validator';
import { Controller, Patch, Body } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { LikeService } from './like.service';

export class LikeComment {
  @IsDefined()
  @IsInt()
  @prop({ required: true })
  comment_id: number;
}

export class LikeArticle {
  @IsDefined()
  @IsInt()
  @prop({ required: true })
  article_id: number;
}

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Patch('site')
  @HttpProcessor.handle('爱你么么扎！喜欢主站')
  likeSite(): Promise<boolean> {
    return this.likeService.likeSite();
  }

  @Patch('comment')
  @HttpProcessor.handle('爱你么么扎！点赞评论')
  likeComment(@Body() likeComment: LikeComment): Promise<boolean> {
    return this.likeService.likeComment(likeComment.comment_id);
  }

  @Patch('article')
  @HttpProcessor.handle('爱你么么扎！点赞文章')
  likeArticle(@Body() likeArticle: LikeArticle): Promise<boolean> {
    return this.likeService.likeArticle(likeArticle.article_id);
  }
}
