/**
 * @file Disqus token helper
 * @module module/disqus/token
 * @author Surmon <https://github.com/surmon-china>
 */

import jwt from 'jsonwebtoken'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AccessToken } from '@app/utils/disqus'
import { DISQUS } from '@app/app.config'

export const TOKEN_COOKIE_KEY = '_disqus'

export const encodeToken = (token: AccessToken) => {
  return jwt.sign(token, DISQUS.adminAccessToken, {
    expiresIn: token.expires_in,
  })
}

export const decodeToken = (token: string): AccessToken | null => {
  try {
    const result = jwt.verify(token, DISQUS.adminAccessToken)
    return (result as any) || null
  } catch (error) {
    return null
  }
}

export const CookieToken = createParamDecorator((key: string = TOKEN_COOKIE_KEY, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  const cookies = request.cookies
  const token = cookies[key]
  return token ? decodeToken(token) : null
})
