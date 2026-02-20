/**
 * @file Global identity constant
 * @module constant/identity
 * @author Surmon <https://github.com/surmon-china>
 */

import { AuthRole, AuthPayload } from './auth.constant'

export enum IdentityRole {
  Guest = 'guest',
  Admin = AuthRole.Admin,
  User = AuthRole.User
}

export interface IdentityOptions {
  role: IdentityRole
  token?: string | null
  payload?: AuthPayload | null
}

export class Identity {
  public readonly role: IdentityRole
  public readonly token: string | null
  public readonly payload: AuthPayload | null

  constructor(options: IdentityOptions) {
    this.role = options.role
    this.token = options.token ?? null
    this.payload = options.payload ?? null
  }

  get isGuest() {
    return this.role === IdentityRole.Guest
  }

  get isAdmin() {
    return this.role === IdentityRole.Admin
  }

  get isUser() {
    return this.role === IdentityRole.User
  }
}
