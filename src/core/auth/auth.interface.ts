/**
 * @file Global Auth interface
 * @module core/auth/interface
 * @author Surmon <https://github.com/surmon-china>
 */

// https://datatracker.ietf.org/doc/html/rfc6749
export interface AuthTokenResult {
  token_type: 'Bearer'
  access_token: string
  expires_in: number
  refresh_token?: string
}
