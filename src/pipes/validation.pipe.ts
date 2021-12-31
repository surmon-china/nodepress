/**
 * @file Validation pipe
 * @module pipe/validation
 * @author Surmon <https://github.com/surmon-china>
 */

import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { ValidationError } from '@app/errors/validation.error'

/**
 * @class ValidationPipe
 * @classdesc 验证所有使用 class-validator 的地方的 class 模型
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find((type) => metatype === type)
  }

  async transform(value, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      const messages: string[] = []
      const pushMessage = (constraints = {}) => {
        messages.push(...Object.values<any>(constraints))
      }

      errors.forEach((error) => {
        if (error.constraints) {
          pushMessage(error.constraints)
        }
        // MARK: keep 1 level > Maximum call stack
        if (error.children) {
          error.children.forEach((e) => pushMessage(e.constraints))
        }
      })

      throw new ValidationError(messages.join('; '))
    }

    return value
  }
}
