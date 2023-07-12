/**
 * @file HTTP interface
 * @module interface/http
 * @author Surmon <https://github.com/surmon-china>
 */

export type ResponseMessage = string
export enum ResponseStatus {
  Error = 'error',
  Success = 'success'
}

export interface HttpResponseBase {
  status: ResponseStatus
  message: ResponseMessage
}

export type ExceptionInfo =
  | ResponseMessage
  | {
      message: ResponseMessage
      error?: any
    }

// paginate data
export interface HttpPaginateResult<T> {
  data: T
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
  params?: any
  result: T | HttpPaginateResult<T>
}

// HTTP response
export type HttpResponse<T> = HttpResponseError | HttpResponseSuccess<T>
