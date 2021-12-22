/**
 * @file Like service
 * @module module/like/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OptionService } from '@app/modules/option/option.service'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'

@Injectable()
export class LikeService {
  constructor(
    private readonly optionService: OptionService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService
  ) {}

  // 喜欢主站
  public async likeSite(): Promise<boolean> {
    const option = await this.optionService.getDBOption()
    option.meta.likes++
    await option.save()
    await this.optionService.updateCache()
    return true
  }

  // 喜欢评论
  public async likeComment(commentID: number): Promise<boolean> {
    const comment = await this.commentService.getDetailByNumberId(commentID)
    comment.likes++
    await comment.save()
    return true
  }

  // 喜欢文章
  public async likeArticle(articleID: number): Promise<boolean> {
    const article = await this.articleService.getDetailByNumberId(articleID)
    article.meta.likes++
    await article.save()
    return true
  }
}
