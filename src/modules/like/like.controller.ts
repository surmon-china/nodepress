/**
 * Like controller.
 * @file 点赞模块控制器
 * @module module/like/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Patch, Body } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { LikeService } from './like.service';

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
  likeComment(@Body('id') commentId: number): Promise<boolean> {
    return this.likeService.likeComment(commentId);
  }

  @Patch('article')
  @HttpProcessor.handle('爱你么么扎！点赞文章')
  likeArticle(@Body('id') articleId: number): Promise<boolean> {
    return this.likeService.likeArticle(articleId);
  }
}
