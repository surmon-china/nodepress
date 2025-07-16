/**
 * @file Auth jwt service
 * @module core/auth/service
 * @author Surmon <https://github.com/surmon-china>
 */

import _isEqual from 'lodash/isEqual'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { getInvalidatedTokenCacheKey } from '@app/constants/cache.constant'
import { CacheService } from '@app/core/cache/cache.service'
import { APP_BIZ } from '@app/app.config'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private cacheService: CacheService
  ) {}

  public async invalidateToken(token: string): Promise<void> {
    const payload = this.jwtService.decode<{ exp?: number }>(token)
    const now = Math.floor(Date.now() / 1000)
    // Token is already expired, no need to invalidate
    if (!payload?.exp || payload.exp <= now) {
      return
    }
    const ttl = payload.exp - now
    const key = getInvalidatedTokenCacheKey(token)
    await this.cacheService.set(key, '1', ttl)
  }

  public async isTokenInvalidated(token: string): Promise<boolean> {
    const key = getInvalidatedTokenCacheKey(token)
    return await this.cacheService.has(key)
  }

  public signToken() {
    return this.jwtService.sign({ data: APP_BIZ.AUTH.data })
  }

  public async verifyToken(token: string): Promise<boolean> {
    if (await this.isTokenInvalidated(token)) {
      return false
    }

    try {
      const payload = this.jwtService.verify(token, { secret: APP_BIZ.AUTH.jwtSecret })
      return _isEqual(payload.data, APP_BIZ.AUTH.data)
    } catch {
      return false
    }
  }

  public extractTokenFromAuthorization(authorization?: string): string | undefined {
    const [type, token] = authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
