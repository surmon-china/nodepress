/**
 * @file SuccessResponse decorator
 * @module decorator/success-response
 * @author Surmon <https://github.com/surmon-china>
 */

import { SetMetadata, type HttpStatus } from '@nestjs/common'
import type { ResponseMessage } from '@app/interfaces/response.interface'
import { reflector } from '@app/constants/reflector.constant'

const METADATA_HTTP_SUCCESS_CODE = 'app:http:status_code'
const METADATA_HTTP_SUCCESS_MESSAGE = 'app:http:success_message'
const METADATA_HTTP_RESPONSE_TRANSFORM = 'app:http:response_transform'
const METADATA_HTTP_RESPONSE_PAGINATE = 'app:http:response_paginate'

export interface SuccessResponseOptions {
  status?: HttpStatus
  message?: ResponseMessage
  useTransform?: boolean
  usePaginate?: boolean
}

export const getSuccessResponseOptions = (target: any): SuccessResponseOptions => ({
  message: reflector.get<string>(METADATA_HTTP_SUCCESS_MESSAGE, target),
  status: reflector.get<HttpStatus>(METADATA_HTTP_SUCCESS_CODE, target),
  useTransform: reflector.get<boolean>(METADATA_HTTP_RESPONSE_TRANSFORM, target),
  usePaginate: reflector.get<boolean>(METADATA_HTTP_RESPONSE_PAGINATE, target)
})

export type SuccessResponseDecoratorOptions = Omit<SuccessResponseOptions, 'useTransform'>

/**
 * @function handle
 * @example ```@SuccessResponse('Get data succeeded')```
 * @example ```@SuccessResponse({ message: 'Get data succeeded', status: 200, usePaginate: true })```
 */
export function SuccessResponse(input: string | SuccessResponseDecoratorOptions): MethodDecorator {
  const options: SuccessResponseDecoratorOptions = typeof input === 'string' ? { message: input } : input
  return (_, __, descriptor: PropertyDescriptor) => {
    SetMetadata(METADATA_HTTP_RESPONSE_TRANSFORM, true)(descriptor.value)
    if (options.status) {
      SetMetadata(METADATA_HTTP_SUCCESS_CODE, options.status)(descriptor.value)
    }
    if (options.message) {
      SetMetadata(METADATA_HTTP_SUCCESS_MESSAGE, options.message)(descriptor.value)
    }
    if (options.usePaginate) {
      SetMetadata(METADATA_HTTP_RESPONSE_PAGINATE, true)(descriptor.value)
    }
    return descriptor
  }
}
