/**
 * @file HTTP response interface
 * @module interface/response
 * @author Surmon <https://github.com/surmon-china>
 */

export type ResponseMessage = string
export enum ResponseStatus {
  Error = 'error',
  Success = 'success'
}

export interface PaginationPayload<T> {
  data: T
  pagination: {
    total: number
    current_page: number
    total_page: number
    per_page: number
  }
}

export interface HttpErrorResponse {
  status: ResponseStatus.Error
  message: ResponseMessage
  error: string
  timestamp: string
}

export interface HttpSuccessResponse<T> {
  status: ResponseStatus.Success
  message: ResponseMessage
  result: T | PaginationPayload<T>
  context?: any
}
