/**
 * @file Permission pipe
 * @module pipe/permission
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import type { FastifyRequest } from 'fastify'
import type { PipeTransform } from '@nestjs/common'
import { Injectable, Inject, Scope, ForbiddenException } from '@nestjs/common'
import { getGuestRequestPermission } from '@app/decorators/guest-permission.decorator'
import { REQUEST } from '@nestjs/core'

/**
 * @class PermissionPipe
 * @classdesc Validate metatype class permission & set default value.
 */
@Injectable({ scope: Scope.REQUEST })
export class PermissionPipe implements PipeTransform<any> {
  constructor(@Inject(REQUEST) protected readonly request: FastifyRequest) {}

  transform(value) {
    // Allow any authenticated user to pass through without validation.
    if (this.request.locals.isAuthenticated) {
      return value
    }

    Object.keys(value).forEach((field) => {
      const fieldValue = value[field]
      const fieldMeta = getGuestRequestPermission(value, field)

      // Only validate permission when user explicitly provides the query param.
      if (!_isUndefined(fieldValue)) {
        // Validate guest user request params's field permission.
        if (fieldMeta?.only?.length && !fieldMeta.only.includes(fieldValue)) {
          throw new ForbiddenException(
            `Invalid value for field '${field}': allowed values are [${fieldMeta.only.join(', ')}]`
          )
        }
      }

      // Set default value for guest param if not provided and default is defined.
      if (_isUndefined(fieldValue) && !_isUndefined(fieldMeta?.default)) {
        value[field] = fieldMeta.default
      }
    })

    // HACK: Persisting validated query params to request.locals for debugging (non-standard side effect)
    this.request.locals.validatedQueryParams = { ...value }

    return value
  }
}
