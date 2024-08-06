/**
 * @file Responser
 * @module decorator/responser
 * @author Surmon <https://github.com/surmon-china>
 */

import _isObject from 'lodash/isObject'
import { SetMetadata, HttpStatus } from '@nestjs/common'
import { ResponseMessage } from '@app/interfaces/response.interface'
import { UNDEFINED } from '@app/constants/value.constant'
import { reflector } from '@app/constants/reflector.constant'
import * as META from '@app/constants/meta.constant'
import * as TEXT from '@app/constants/text.constant'

export interface ResponserOptions extends Omit<DecoratorCreatorOption, 'usePaginate'> {
  transform?: boolean
  paginate?: boolean
}

export const getResponserOptions = (target: any): ResponserOptions => {
  return {
    errorCode: reflector.get(META.HTTP_ERROR_CODE, target),
    successCode: reflector.get(META.HTTP_SUCCESS_CODE, target),
    errorMessage: reflector.get(META.HTTP_ERROR_MESSAGE, target),
    successMessage: reflector.get(META.HTTP_SUCCESS_MESSAGE, target),
    transform: reflector.get(META.HTTP_RESPONSE_TRANSFORM, target),
    paginate: reflector.get(META.HTTP_RESPONSE_TRANSFORM_TO_PAGINATE, target)
  }
}

interface DecoratorCreatorOption {
  errorCode?: HttpStatus
  successCode?: HttpStatus
  errorMessage?: ResponseMessage
  successMessage?: ResponseMessage
  usePaginate?: boolean
}

interface HandleOption {
  error?: HttpStatus
  success?: HttpStatus
  message: ResponseMessage
  usePaginate?: boolean
}

type HandleOptionConfig = ResponseMessage | HandleOption

const createDecorator = (options: DecoratorCreatorOption): MethodDecorator => {
  const { errorMessage, successMessage, errorCode, successCode, usePaginate } = options
  return (_, __, descriptor: PropertyDescriptor) => {
    SetMetadata(META.HTTP_RESPONSE_TRANSFORM, true)(descriptor.value)
    if (errorCode) {
      SetMetadata(META.HTTP_ERROR_CODE, errorCode)(descriptor.value)
    }
    if (successCode) {
      SetMetadata(META.HTTP_SUCCESS_CODE, successCode)(descriptor.value)
    }
    if (errorMessage) {
      SetMetadata(META.HTTP_ERROR_MESSAGE, errorMessage)(descriptor.value)
    }
    if (successMessage) {
      SetMetadata(META.HTTP_SUCCESS_MESSAGE, successMessage)(descriptor.value)
    }
    if (usePaginate) {
      SetMetadata(META.HTTP_RESPONSE_TRANSFORM_TO_PAGINATE, true)(descriptor.value)
    }
    return descriptor
  }
}

/**
 * @exports success
 * @example ```@HttpProcessor.success('error message', 500)```
 */
export const error = (message: ResponseMessage, statusCode?: HttpStatus): MethodDecorator => {
  return createDecorator({ errorMessage: message, errorCode: statusCode })
}

/**
 * @exports success
 * @example ```@HttpProcessor.success('success message', 200)```
 */
export const success = (message: ResponseMessage, statusCode?: HttpStatus): MethodDecorator => {
  return createDecorator({
    successMessage: message,
    successCode: statusCode
  })
}

/**
 * @function handle
 * @example ```@HttpProcessor.handle('Some request')```
 * @example ```@HttpProcessor.handle({ message: 'Some request', error: error, success: 200, usePaginate: true })```
 */
export function handle(args: HandleOptionConfig): MethodDecorator
export function handle(...args) {
  const option = args[0]
  const isOption = (value: HandleOptionConfig): value is HandleOption => _isObject(value)
  const message: ResponseMessage = isOption(option) ? option.message : option
  const errorMessage: ResponseMessage = message + TEXT.HTTP_ERROR_SUFFIX
  const successMessage: ResponseMessage = message + TEXT.HTTP_SUCCESS_SUFFIX
  const errorCode = isOption(option) ? option.error : UNDEFINED
  const successCode = isOption(option) ? option.success : UNDEFINED
  const usePaginate = isOption(option) ? option.usePaginate : false
  return createDecorator({
    errorCode,
    successCode,
    errorMessage,
    successMessage,
    usePaginate
  })
}

/**
 * @exports paginate
 * @example ```@HttpProcessor.paginate()```
 */
export const paginate = (): MethodDecorator => {
  return createDecorator({ usePaginate: true })
}

export const Responser = { error, success, handle, paginate }
