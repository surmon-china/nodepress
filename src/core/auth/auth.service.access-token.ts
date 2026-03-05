/**
 * @file Global Auth JWT service
 * @module core/auth/service.access-token
 * @author Surmon <https://github.com/surmon-china>
 * @link https://docs.nestjs.com/security/authentication#enable-authentication-globally
 */

import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt'
import { CacheService } from '@app/core/cache/cache.service'
import { AuthPayload } from '@app/constants/auth.constant'
import { getInvalidatedTokenCacheKey } from '@app/constants/cache.constant'

@Injectable()
export class AuthAccessTokenService {
  constructor(
    private jwtService: JwtService,
    private cacheService: CacheService
  ) {}

  public async isInvalidatedToken(token: string): Promise<boolean> {
    const key = getInvalidatedTokenCacheKey(token)
    return await this.cacheService.has(key)
  }

  public decodeToken<T extends object = any>(token: string): T | null {
    return this.jwtService.decode<T>(token)
  }

  public signToken<T extends AuthPayload = AuthPayload>(payload: T, options?: JwtSignOptions): string {
    return this.jwtService.sign<T>(payload, options)
  }

  public async verifyToken<T extends AuthPayload = AuthPayload>(
    token: string,
    options?: JwtVerifyOptions
  ): Promise<T | null> {
    if (await this.isInvalidatedToken(token)) {
      return null
    } else {
      return await this.jwtService.verifyAsync<T>(token, options)
    }
  }

  public async invalidateToken(token: string): Promise<void> {
    const payload = this.jwtService.decode<{ exp?: number }>(token)
    if (!payload?.exp) return

    // Token is already expired, no need to invalidate
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp <= now) return

    const ttl = payload.exp - now
    const key = getInvalidatedTokenCacheKey(token)
    await this.cacheService.set(key, '1', ttl)
  }

  public extractTokenFromAuthorization(authorization?: string): string | undefined {
    const [type, token] = authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
