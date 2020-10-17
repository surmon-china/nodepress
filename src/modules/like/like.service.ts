/**
 * Like service.
 * @file 点赞模块数据服务
 * @module module/like/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common';
import { OptionService } from '@app/modules/option/option.service';
import { ArticleService } from '@app/modules/article/article.service';
import { CommentService } from '@app/modules/comment/comment.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly optionService: OptionService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  // 喜欢主站
  public async likeSite(): Promise<boolean> {
    const option = await this.optionService.getDBOption();
    option.meta.likes++;
    await option.save();
    return true;
  }

  // 喜欢评论
  public async likeComment(commentId: number): Promise<boolean> {
    const comment = await this.commentService.getDetailByNumberId(commentId);
    comment.likes++;
    await comment.save();
    return true;
  }

  // 喜欢文章
  public async likeArticle(articleId: number): Promise<boolean> {
    const article = await this.articleService.getDetailByNumberId(articleId);
    article.meta.likes++;
    await article.save();
    return true;
  }
}
