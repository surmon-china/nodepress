/**
 * @file Article stats service
 * @module module/article/service.stats
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, BadRequestException } from '@nestjs/common'
import { MongooseModel, MongooseId } from '@app/interfaces/mongoose.interface'
import { InjectModel } from '@app/transformers/model.transformer'
import { SortOrder } from '@app/constants/sort.constant'
import { ARTICLE_PUBLIC_FILTER } from './article.constant'
import { Article } from './article.model'

@Injectable()
export class ArticleStatsService {
  constructor(@InjectModel(Article) private readonly articleModel: MongooseModel<Article>) {}

  public async getCountsByTagIds(tagIds: MongooseId[], publicOnly: boolean) {
    const matchStage = publicOnly ? { ...ARTICLE_PUBLIC_FILTER } : {}
    const counts = await this.articleModel.aggregate<{ _id: MongooseId; count: number }>([
      { $match: { tags: { $in: tagIds }, ...matchStage } },
      { $unwind: '$tags' },
      { $match: { tags: { $in: tagIds } } },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ])
    return new Map(counts.map((c) => [c._id.toString(), c.count]))
  }

  public async getCountsByCategoryIds(categoryIds: MongooseId[], publicOnly: boolean) {
    const matchStage = publicOnly ? { ...ARTICLE_PUBLIC_FILTER } : {}
    const counts = await this.articleModel.aggregate<{ _id: MongooseId; count: number }>([
      { $match: { categories: { $in: categoryIds }, ...matchStage } },
      { $unwind: '$categories' },
      { $match: { categories: { $in: categoryIds } } },
      { $group: { _id: '$categories', count: { $sum: 1 } } }
    ])
    return new Map(counts.map((c) => [c._id.toString(), c.count]))
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

  public getTotalCount(publicOnly: boolean): Promise<number> {
    return this.articleModel.countDocuments(publicOnly ? ARTICLE_PUBLIC_FILTER : {}).exec()
  }
}
