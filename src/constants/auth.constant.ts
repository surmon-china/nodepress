/**
 * @file Global auth constants
 * @module constants/auth
 * @author Surmon <https://github.com/surmon-china>
 */

export enum AuthRole {
  Admin = 'admin',
  User = 'user'
}

export interface AuthPayload {
  role: AuthRole
  uid?: number
  [key: string]: unknown
}
