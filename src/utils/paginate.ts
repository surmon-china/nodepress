/**
 * @file mongoose paginate plugin
 * @module utils/paginate
 * @author Surmon <https://github.com/surmon-china>
 */

import lodashMerge from 'lodash/merge'
import type { Model, Document, Schema, FilterQuery, QueryOptions } from 'mongoose'

export interface PaginateResult<T> {
  documents: Array<T>
  total: number
  page: number
  perPage: number
  totalPage: number
}

export type PaginateQuery<T = any> = FilterQuery<T>
export interface PaginateOptions {
  /** paginate options */
  page?: number
  perPage?: number
  dateSort?: 1 | -1
  /** original options */
  projection?: string | object | null
  /** mongoose queryOptions */
  sort?: QueryOptions['sort']
  lean?: QueryOptions['lean']
  populate?: QueryOptions['populate']
  /** original options for `model.find` */
  $queryOptions?: QueryOptions
}

const DEFAULT_OPTIONS: Required<Pick<PaginateOptions, 'page' | 'perPage' | 'dateSort' | 'lean'>> = Object.freeze({
  page: 1,
  perPage: 16,
  dateSort: -1,
  lean: false
})

export interface PaginateModel<T extends Document> extends Model<T> {
  paginate(query?: PaginateQuery<T>, options?: PaginateOptions): Promise<PaginateResult<T>>
}

export function mongoosePaginate(schema: Schema) {
  schema.statics.paginate = paginate
}

export function paginate<T>(this: Model<T>, filterQuery: PaginateQuery<T> = {}, options: PaginateOptions = {}) {
  const { page, perPage, dateSort, projection, $queryOptions, ...resetOptions } = lodashMerge(
    { ...DEFAULT_OPTIONS },
    { ...options }
  )

  const findQueryOptions = {
    ...resetOptions,
    ...$queryOptions
  }

  // query
  const countQuery = this.countDocuments ? this.countDocuments(filterQuery).exec() : this.count(filterQuery).exec()
  const pageQuery = this.find(filterQuery, projection, {
    skip: (page - 1) * perPage,
    limit: perPage,
    sort: dateSort ? { _id: dateSort } : findQueryOptions.sort,
    ...findQueryOptions
  }).exec()

  return Promise.all([countQuery, pageQuery]).then(([countResult, pageResult]) => {
    const result: PaginateResult<T> = {
      documents: pageResult,
      total: countResult,
      page,
      perPage,
      totalPage: Math.ceil(countResult / perPage) || 1
    }
    return result
  })
}
