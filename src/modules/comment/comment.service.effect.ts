/**
 * @file Comment effect service
 * @module module/comment/service.effect
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { ArticleStatsService } from '@app/modules/article/article.service.stats'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { CommentTargetType, COMMENT_PUBLIC_FILTER } from './comment.constant'
import { Comment } from './comment.model'

const logger = createLogger({ scope: 'CommentEffectService', time: isDevEnv })

export type CommentTarget = Pick<Comment, 'target_type' | 'target_id'>

@Injectable()
export class CommentEffectService {
  constructor(
    private readonly articleStatsService: ArticleStatsService,
    @InjectModel(Comment) private readonly commentModel: MongooseModel<Comment>
  ) {}

  /** Sync effects to targets */
  public async syncTargetEffects(targets: CommentTarget[]): Promise<void> {
    if (!targets.length) return

    const articleIds = this.getUniqueTargetIds(targets, CommentTargetType.Article)
    if (articleIds.length > 0) {
      await this.syncArticleCommentCounts(articleIds)
    }
  }

  private getUniqueTargetIds(targets: CommentTarget[], type: CommentTargetType): number[] {
    return [...new Set(targets.filter((t) => t.target_type === type).map((t) => t.target_id))]
  }

  private async syncArticleCommentCounts(articleIds: number[]): Promise<void> {
    try {
      const counts = await this.commentModel.aggregate<{ _id: number; comment_count: number }>([
        {
          $match: {
            ...COMMENT_PUBLIC_FILTER,
            target_type: CommentTargetType.Article,
            target_id: { $in: articleIds }
          }
        },
        { $group: { _id: '$target_id', comment_count: { $sum: 1 } } }
      ])

      const countMap = new Map(counts.map((c) => [c._id, c.comment_count]))
      await Promise.all(
        // If an ID is missing from the countMap, it means the article has 0 valid comments.
        articleIds.map((id) => this.articleStatsService.updateStatsComments(id, countMap.get(id) || 0))
      )

      // logger.info(`Synced comment counts for ${articleIds.length} articles.`)
    } catch (error) {
      logger.warn('syncArticleCommentCounts failed!', error)
    }
  }
}
