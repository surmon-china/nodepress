/**
 * @file AdminOptional guard
 * @module guard/admin-optional
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyRequest } from 'fastify'
import type { ExecutionContext } from '@nestjs/common'
import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common'

/**
 * @class AdminOptionalGuard
 * @classdesc Allows access if no token is provided, or if a valid token is provided. Denies access if an invalid token is provided.
 * @example ```@UseGuards(AdminOptionalGuard)```
 */
@Injectable()
export class AdminOptionalGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()

    // Allow access if no token is provided
    if (!request.locals.token) {
      return true
    }

    // Allow access if token is valid
    if (request.locals.isAuthenticated) {
      return true
    }

    // Deny access if token is invalid
    throw new UnauthorizedException('Invalid authentication token')
  }
}
