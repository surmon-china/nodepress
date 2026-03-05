/**
 * @file Global Auth refresh token service
 * @module core/auth/service.refresh-token
 * @author Surmon <https://github.com/surmon-china>
 */

import * as crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import { CacheService } from '@app/core/cache/cache.service'
import { AuthPayload } from '@app/constants/auth.constant'
import { getRefreshTokenCacheKey } from '@app/constants/cache.constant'

@Injectable()
export class AuthRefreshTokenService {
  constructor(private cacheService: CacheService) {}

  public generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  public async storeToken(token: string, payload: AuthPayload, expiresIn: number): Promise<void> {
    const key = getRefreshTokenCacheKey(token)
    await this.cacheService.set(key, payload, expiresIn)
  }

  public async revokeToken(token: string): Promise<void> {
    const key = getRefreshTokenCacheKey(token)
    await this.cacheService.delete(key)
  }

  public async getPayload(token: string): Promise<AuthPayload | null> {
    const key = getRefreshTokenCacheKey(token)
    const payload = await this.cacheService.get<AuthPayload>(key)
    return payload ?? null
  }
}
