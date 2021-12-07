/**
 * @file Auth token interface
 * @module module/auth/interface
 * @author Surmon <https://github.com/surmon-china>
 */

export interface TokenResult {
  access_token: string
  expires_in: number
}
