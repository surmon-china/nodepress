/**
 * @file User me interface
 * @module module/user/me/interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { KeyValueModel } from '@app/models/key-value.model'
import { UserIdentityProvider } from '../user.constant'

export interface UpsertUserInput {
  provider: UserIdentityProvider
  uid: string
  name: string
  email: string | null
  website: string | null
  avatar: string | null
  extras?: KeyValueModel[]
}
