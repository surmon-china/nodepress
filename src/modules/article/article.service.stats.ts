/**
 * @file Article stats service
 * @module module/article/service.stats
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { SortOrder } from '@app/constants/sort.constant'
import { ARTICLE_PUBLIC_FILTER } from './article.constant'
import { Article, ArticleStats } from './article.model'

@Injectable()
export class ArticleStatsService {
  constructor(@InjectModel(Article) private readonly articleModel: MongooseModel<Article>) {}

  public async incrementStatistics(articleId: number, field: keyof ArticleStats): Promise<number> {
    const result = await this.articleModel
      .findOneAndUpdate(
        { id: articleId, ...ARTICLE_PUBLIC_FILTER },
        { $inc: { [`stats.${field}`]: 1 } },
        { projection: { [`stats.${field}`]: 1 }, timestamps: false, returnDocument: 'after' }
      )
      .lean()
      .exec()
    return result?.stats?.[field] ?? 0
  }

  public updateStatsComments(articleId: number, commentCount: number) {
    return this.articleModel
      .updateOne({ id: articleId }, { $set: { 'stats.comments': commentCount } }, { timestamps: false })
      .exec()
  }

  public getTotalCount(publicOnly: boolean): Promise<number> {
    return this.articleModel
      .countDocuments(publicOnly ? ARTICLE_PUBLIC_FILTER : {})
      .lean()
      .exec()
  }

  public async getCalendar(publicOnly: boolean, timezone = 'GMT') {
    try {
      const calendar = await this.articleModel.aggregate<{ _id: string; count: number }>([
        { $match: publicOnly ? ARTICLE_PUBLIC_FILTER : {} },
        { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
        { $group: { _id: '$day', count: { $sum: 1 } } },
        { $sort: { _id: SortOrder.Asc } }
      ])
      return calendar.map(({ _id, ...rest }) => ({ ...rest, date: _id }))
    } catch (error) {
      throw new BadRequestException(`Invalid timezone identifier: '${timezone}'`)
    }
  }

  public async getTotalStatistics() {
    const [result] = await this.articleModel.aggregate<{
      _id: null
      totalViews: number
      totalLikes: number
    }>([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$stats.views' },
          totalLikes: { $sum: '$stats.likes' }
        }
      }
    ])

    return {
      totalViews: result?.totalViews ?? 0,
      totalLikes: result?.totalLikes ?? 0
    }
  }
}
