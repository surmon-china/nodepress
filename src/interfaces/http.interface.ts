/**
 * @file HTTP interface
 * @module interface/http
 * @author Surmon <https://github.com/surmon-china>
 */

export type ResponseMessage = string
export enum ResponseStatus {
  Error = 'error',
  Success = 'success',
}

export interface HttpResponseBase {
  status: ResponseStatus
  message: ResponseMessage
}

export type ExceptionOption =
  | ResponseMessage
  | {
      message: ResponseMessage
      error?: any
    }

// 翻页数据
export interface HttpPaginateResult<T> {
  data: T
  params: any
  pagination: {
    total: number
    current_page: number
    total_page: number
    per_page: number
  }
}

// HTTP error
export type HttpResponseError = HttpResponseBase & {
  error: any
  debug?: string
}

// HTTP success
export type HttpResponseSuccess<T> = HttpResponseBase & {
  result: T | HttpPaginateResult<T>
}

// HTTP Response
export type HttpResponse<T> = HttpResponseError | HttpResponseSuccess<T>
