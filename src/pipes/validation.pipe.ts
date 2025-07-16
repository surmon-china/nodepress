/**
 * @file Validation pipe
 * @module pipe/validation
 * @author Surmon <https://github.com/surmon-china>
 */

import { plainToInstance } from 'class-transformer'
import type { ValidationError } from 'class-validator'
import { validate } from 'class-validator'
import type { PipeTransform, ArgumentMetadata } from '@nestjs/common'
import { Injectable, BadRequestException } from '@nestjs/common'

export const isUnverifiableMetaType = (metatype: any): metatype is undefined => {
  const basicTypes = [String, Boolean, Number, Array, Object]
  return !metatype || basicTypes.includes(metatype)
}

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
  async transform(value, { metatype }: ArgumentMetadata) {
    if (isUnverifiableMetaType(metatype)) {
      return value
    }

    const object = plainToInstance(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${collectMessages(errors).join('; ')}`)
    }

    return object
  }
}
