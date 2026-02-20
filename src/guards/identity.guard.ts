/**
 * @file Identity-based access control guard
 * @module guard/identity
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyRequest } from 'fastify'
import type { ExecutionContext } from '@nestjs/common'
import { Injectable, CanActivate, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IdentityRole } from '@app/constants/identity.constant'
import { METADATA_ONLY_IDENTITY_KEY } from '@app/decorators/only-identity.decorator'

/**
 * @description Global authorization guard based on `IdentityRole`.
 *
 * Design principles:
 *  - Default allow (if no restriction decorator is present)
 *  - Explicit restriction via `@OnlyIdentity`
 *  - 401 for unauthenticated (Guest)
 *  - 403 for authenticated but unauthorized
 *
 * This guard implements a lightweight Identity model
 * instead of a traditional RBAC system.
 */
@Injectable()
export class IdentityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { identity } = context.switchToHttp().getRequest<FastifyRequest>()
    // Read identity restriction metadata. Method-level decorator overrides class-level decorator.
    const onlyRoles = this.reflector.getAllAndOverride<IdentityRole[]>(METADATA_ONLY_IDENTITY_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    // No restriction decorator found. Default strategy: allow all identities.
    if (onlyRoles === undefined) return true

    // Role matched → authorized.
    if (onlyRoles.includes(identity.role)) return true

    // Role mismatch
    if (identity.isGuest) {
      // If identity is Guest → treat as unauthenticated.
      throw new UnauthorizedException('Please login to access this resource')
    } else {
      // Otherwise → authenticated but insufficient permission.
      throw new ForbiddenException('You do not have permission to access this resource')
    }
  }
}
