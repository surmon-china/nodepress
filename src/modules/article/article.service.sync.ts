/**
 * @file Article sync service
 * @module module/article/service.sync
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseId } from '@app/interfaces/mongoose.interface'
import { ARTICLE_PUBLIC_FILTER } from './article.constant'
import { Article, ArticleStats } from './article.model'

@Injectable()
export class ArticleSyncService {
  constructor(@InjectModel(Article) private readonly articleModel: MongooseModel<Article>) {}

  public removeTagsFromAllArticles(tagObjectIds: MongooseId | MongooseId[]) {
    const ids = Array.isArray(tagObjectIds) ? tagObjectIds : [tagObjectIds]
    return this.articleModel.updateMany({ tags: { $in: ids } }, { $pull: { tags: { $in: ids } } }).exec()
  }

  public removeCategoriesFromAllArticles(categoryObjectIds: MongooseId | MongooseId[]) {
    const ids = Array.isArray(categoryObjectIds) ? categoryObjectIds : [categoryObjectIds]
    return this.articleModel
      .updateMany({ categories: { $in: ids } }, { $pull: { categories: { $in: ids } } })
      .exec()
  }

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
}
