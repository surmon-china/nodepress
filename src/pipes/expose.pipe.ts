/**
 * @file Expose pipe
 * @module pipe/expose
 * @author Surmon <https://github.com/surmon-china>
 */

import _cloneDeep from 'lodash/cloneDeep'
import { Request } from 'express'
import { REQUEST } from '@nestjs/core'
import { Injectable, Inject, Scope, PipeTransform } from '@nestjs/common'

declare global {
  namespace Express {
    interface Request {
      $validatedPayload?: any
    }
  }
}

/**
 * @class ExposePipe
 * @classdesc Expose request params to request context
 */
@Injectable({ scope: Scope.REQUEST })
export class ExposePipe implements PipeTransform<any> {
  constructor(@Inject(REQUEST) protected readonly request: Request) {}

  transform(value) {
    this.request.$validatedPayload = _cloneDeep(value)
    return value
  }
}
