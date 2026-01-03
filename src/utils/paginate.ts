/**
 * @file mongoose paginate plugin
 * @module utils/paginate
 * @author Surmon <https://github.com/surmon-china>
 */

import _merge from 'lodash/merge'
import type { Model, Schema, QueryFilter, QueryOptions, HydratedDocument } from 'mongoose'

export interface PaginateResult<T> {
  documents: Array<T>
  total: number
  page: number
  perPage: number
  totalPage: number
}

export interface PaginateOptions {
  /** paginate options */
  page?: number
  perPage?: number
  dateSort?: 1 | -1
  /** original options */
  projection?: string | object | null
  /** mongoose queryOptions */
  sort?: QueryOptions['sort']
  populate?: QueryOptions['populate']
  /** original options for `model.find` */
  $queryOptions?: QueryOptions
}

const DEFAULT_OPTIONS: Required<Pick<PaginateOptions, 'page' | 'perPage' | 'dateSort'>> = Object.freeze({
  page: 1,
  perPage: 16,
  dateSort: -1 as const
})

function doPaginate<TRawDocType>(
  this: Model<TRawDocType>,
  queryFilter: QueryFilter<TRawDocType> = {},
  paginateOptions: PaginateOptions = {},
  forceLean = false
) {
  const { page, perPage, dateSort, projection, $queryOptions, ...restOptions } = _merge(
    { ...DEFAULT_OPTIONS },
    { ...paginateOptions }
  )

  const findQueryOptions: QueryOptions<TRawDocType> = {
    ...restOptions,
    ...$queryOptions,
    lean: forceLean
  }

  // query
  const countQuery = this.countDocuments(queryFilter).exec()
  const listQuery = this.find(queryFilter, projection, {
    skip: (page - 1) * perPage,
    limit: perPage,
    sort: dateSort ? { _id: dateSort } : findQueryOptions.sort,
    ...findQueryOptions
  }).exec()

  return Promise.all([countQuery, listQuery]).then(([countResult, listResult]) => ({
    documents: listResult,
    total: countResult,
    page,
    perPage,
    totalPage: Math.ceil(countResult / perPage) || 1
  }))
}

export type PaginateStatics<TRawDocType, THydratedDocType = HydratedDocument<TRawDocType>> = {
  paginate(filter?: QueryFilter<TRawDocType>, options?: PaginateOptions): Promise<PaginateResult<THydratedDocType>>
  paginateRaw(filter?: QueryFilter<TRawDocType>, options?: PaginateOptions): Promise<PaginateResult<TRawDocType>>
}

export function mongoosePaginate(schema: Schema) {
  schema.statics.paginate = function (this: any, filter?: any, options?: any) {
    return doPaginate.call(this, filter, options, false)
  }
  schema.statics.paginateRaw = function (this: any, filter?: any, options?: any) {
    return doPaginate.call(this, filter, options, true)
  }
}
