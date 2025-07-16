/**
 * @file Admin auth token interface
 * @module module/admin/interface
 * @author Surmon <https://github.com/surmon-china>
 */

export interface TokenResult {
  access_token: string
  expires_in: number
}
