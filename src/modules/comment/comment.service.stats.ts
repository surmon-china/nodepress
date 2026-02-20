/**
 * @file Comment service
 * @module module/comment/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Injectable, BadRequestException } from '@nestjs/common'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { InjectModel } from '@app/transformers/model.transformer'
import { SortOrder } from '@app/constants/sort.constant'
import { COMMENT_PUBLIC_FILTER } from './comment.constant'
import { Comment } from './comment.model'
import { isDevEnv } from '@app/app.environment'
import { createLogger } from '@app/utils/logger'

const logger = createLogger({ scope: 'CommentStatsService', time: isDevEnv })

@Injectable()
export class CommentStatsService {
  constructor(@InjectModel(Comment) private readonly commentModel: MongooseModel<Comment>) {}

  public countDocuments(queryFilter: QueryFilter<Comment>): Promise<number> {
    return this.commentModel.countDocuments(queryFilter).lean().exec()
  }

  public getTotalCount(publicOnly: boolean): Promise<number> {
    return this.countDocuments(publicOnly ? COMMENT_PUBLIC_FILTER : {})
  }

  public async getCalendar(publicOnly: boolean, timezone = 'GMT'): Promise<Array<{ date: string; count: number }>> {
    try {
      const calendar = await this.commentModel.aggregate<{ _id: string; count: number }>([
        { $match: publicOnly ? COMMENT_PUBLIC_FILTER : {} },
        { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
        { $group: { _id: '$day', count: { $sum: 1 } } },
        { $sort: { _id: SortOrder.Asc } }
      ])
      return calendar.map(({ _id, count }) => ({ date: _id, count }))
    } catch (error: unknown) {
      throw new BadRequestException(`Invalid timezone identifier: '${timezone}'`, String(error))
    }
  }
}
