/**
 * @file Article context service
 * @module module/article/service.context
 * @author Surmon <https://github.com/surmon-china>
 */

import type { SortOrder as SortOrderType } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { SortOrder } from '@app/constants/sort.constant'
import { ARTICLE_PUBLIC_FILTER } from './article.constant'
import { ARTICLE_RELATION_FIELDS, ARTICLE_LIST_QUERY_PROJECTION } from './article.model'
import { Article, ArticleListItemPopulated } from './article.model'

@Injectable()
export class ArticleContextService {
  constructor(@InjectModel(Article) private readonly articleModel: MongooseModel<Article>) {}

  // Get near articles
  public async getNearArticles(
    articleId: number,
    type: 'later' | 'early',
    count: number
  ): Promise<ArticleListItemPopulated[]> {
    const typeFieldMap = {
      early: { field: '$lt', sort: -1 as SortOrderType },
      later: { field: '$gt', sort: 1 as SortOrderType }
    }
    const targetType = typeFieldMap[type]
    return this.articleModel
      .find({ ...ARTICLE_PUBLIC_FILTER, id: { [targetType.field]: articleId } })
      .select(ARTICLE_LIST_QUERY_PROJECTION)
      .populate<ArticleListItemPopulated>(ARTICLE_RELATION_FIELDS)
      .sort({ id: targetType.sort })
      .limit(count)
      .lean()
      .exec()
  }

  // Get related articles
  public async getRelatedArticles(article: Article, count: number): Promise<ArticleListItemPopulated[]> {
    // 1. Guard Clause: "Hard-match" logic requires both tags and categories to compute similarity.
    // If either is missing, return an empty array to avoid irrelevant global results.
    if (!article.tags?.length || !article.categories?.length) {
      return []
    }

    return await this.articleModel.aggregate<ArticleListItemPopulated>([
      {
        // 2. Initial Match: Filter by public status and ensure intersection in BOTH tags AND categories.
        $match: {
          ...ARTICLE_PUBLIC_FILTER,
          tags: { $in: article.tags },
          categories: { $in: article.categories },
          // Exclude the current article in the query
          id: { $ne: article.id }
        }
      },
      {
        // 3. Similarity Scoring: Calculate the size of the intersection between sets.
        $addFields: {
          tagScore: { $size: { $setIntersection: ['$tags', article.tags] } },
          categoryScore: { $size: { $setIntersection: ['$categories', article.categories] } }
        }
      },
      {
        // 4. Weighted Ranking: Tags represent specific content details, so they are given 2x the weight of broad categories.
        $addFields: {
          totalScore: {
            $add: [{ $multiply: ['$tagScore', 2] }, '$categoryScore']
          }
        }
      },
      // 5. Sort: Rank primarily by total similarity score, then by recency.
      { $sort: { totalScore: SortOrder.Desc, created_at: SortOrder.Desc } },
      // 6. Top-K Sampling Strategy:
      // We limit to a candidate pool of (count * 2) high-relevance articles,
      // then randomly sample from that pool to provide a fresh experience on every refresh.
      { $limit: count * 2 },
      { $sample: { size: count } },
      // 7. Projection & Safety:
      // Aggregation bypasses Mongoose's default 'select' schema configuration.
      // We must manually apply the PROJECTION to exclude large fields (e.g., content)
      // and maintain consistency with the standard article list structure.
      { $project: ARTICLE_LIST_QUERY_PROJECTION },
      // 8. Manual Population:
      // Aggregation does not support automatic Mongoose population.
      // Use $lookup to join related collections (tags, categories).
      ...ARTICLE_RELATION_FIELDS.map((field) => ({
        $lookup: {
          from: field, // Name of the collection to join (e.g., categories)
          localField: field, // Field from the input documents (e.g., categories)
          foreignField: '_id', // Field from the documents of the "from" collection
          as: field // Output array field (e.g., categories)
        }
      }))
    ])
  }
}
