/**
 * @file AdminOnly guard
 * @module guard/admin-only
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyRequest } from 'fastify'
import type { ExecutionContext } from '@nestjs/common'
import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common'

/**
 * @class AdminOnlyGuard
 * @classdesc Allows access only when a valid token is provided and authenticated.
 * @example ```@UseGuards(AdminOnlyGuard)```
 */
@Injectable()
export class AdminOnlyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()

    // Allow only if authenticated
    if (request.locals.isAuthenticated) {
      return true
    }

    // Deny if not authenticated
    throw new UnauthorizedException('Authentication required')
  }
}
