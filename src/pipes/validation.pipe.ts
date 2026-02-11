/**
 * @file Validation pipe
 * @module pipe/validation
 * @author Surmon <https://github.com/surmon-china>
 */

import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import type { ValidationError } from 'class-validator'
import type { PipeTransform, ArgumentMetadata } from '@nestjs/common'
import { Injectable, BadRequestException } from '@nestjs/common'

const UNVERIFIABLE_TYPES = [String, Boolean, Number, Array, Object]

const collectMessages = (errors: ValidationError[]) => {
  const messages: string[] = []
  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values<any>(error.constraints))
    }
    if (error.children?.length) {
      messages.push(...collectMessages(error.children))
    }
  }
  return messages
}

/**
 * @class ValidationPipe
 * @classdesc validate meta type class format
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, { type, metatype }: ArgumentMetadata) {
    // There is no validation for any custom decorator.
    // Reference: https://docs.nestjs.com/custom-decorators#working-with-pipes
    if (type === 'custom') {
      return value
    }

    // If the metatype is not defined or is one of the primitive types,
    // we skip validation as they are not meant to be validated.
    // This is to prevent unnecessary validation errors for primitive types.
    // Note: `metatype` can be undefined if the DTO is not provided.
    // Reference: https://docs.nestjs.com/pipes#custom-pipes
    if (!metatype || UNVERIFIABLE_TYPES.includes(metatype as any)) {
      return value
    }

    const object = plainToInstance(metatype, value ?? {})
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${collectMessages(errors).join('; ')}`)
    }

    // Note: `plainToInstance` does not mutate the original object,
    // so the transformed object must be returned in order
    // for the downstream business to get the correct data type.
    return object
  }
}
