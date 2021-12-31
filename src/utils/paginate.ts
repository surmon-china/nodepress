/**
 * @file mongoose paginate plugin
 * @module utils/paginate
 * @author Surmon <https://github.com/surmon-china>
 */

import { Model, Document, Schema, FilterQuery, QueryOptions } from 'mongoose'

export interface PaginateResult<T> {
  documents: Array<T>
  total: number
  page: number
  perPage: number
  totalPage: number
  offset?: number
}

export interface PaginateOptions {
  /** paginate options */
  page: number
  perPage: number
  offset: number
  select: string | object
  /** mongoose queryOptions */
  sort: QueryOptions['sort']
  populate: QueryOptions['populate']
  lean: QueryOptions['lean']
  /** original options for `model.find` */
  queryOptions: QueryOptions
}

const DEFAULT_OPTIONS = Object.freeze({
  page: 1,
  perPage: 16,
  offset: 0,
  lean: false,
})

export interface PaginateModel<T extends Document> extends Model<T> {
  paginate(query?: FilterQuery<T>, options?: Partial<PaginateOptions>): Promise<PaginateResult<T>>
}

export function mongoosePaginate(schema: Schema) {
  schema.statics.paginate = paginate
}

export function paginate<T>(
  this: Model<T>,
  filterQuery: FilterQuery<T> = {},
  options: Partial<PaginateOptions> = {}
) {
  const { page, perPage, offset, select, queryOptions, ...resetOptions } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const skip = offset > 0 ? offset : (page - 1) * perPage

  const countQuery = this.countDocuments ? this.countDocuments(filterQuery).exec() : this.count(filterQuery).exec()
  const pageQuery = this.find(filterQuery, select, {
    skip,
    limit: perPage,
    ...resetOptions,
    ...queryOptions,
  }).exec()

  return Promise.all([countQuery, pageQuery]).then(([countResult, pageResult]) => {
    const result: PaginateResult<T> = {
      documents: pageResult,
      total: countResult,
      page,
      perPage,
      totalPage: Math.ceil(countResult / perPage) || 1,
    }

    return result
  })
}
