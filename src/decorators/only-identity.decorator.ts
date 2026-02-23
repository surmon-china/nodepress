/**
 * @file Identity admission decorator
 * @module decorator/only-identity
 * @author Surmon <https://github.com/surmon-china>
 */

import { SetMetadata } from '@nestjs/common'
import { IdentityRole } from '@app/constants/identity.constant'
export { IdentityRole } from '@app/constants/identity.constant'

export const METADATA_ONLY_IDENTITY_KEY = 'app:only_identity'

/**
 * Restricts access to specific identities. If not present, the route is public by default.
 * @example ```@OnlyIdentity(IdentityRole.Admin)``` -> Only Admin allowed
 * @example ```@OnlyIdentity(IdentityRole.Admin, IdentityRole.Guest)``` -> Admin or Guest
 * @example ```@OnlyIdentity(IdentityRole.Admin, IdentityRole.User)``` -> Logged-in users only
 * @example ```@OnlyIdentity(IdentityRole.User)``` -> Only User allowed
 */
export const OnlyIdentity = (...roles: IdentityRole[]) => SetMetadata(METADATA_ONLY_IDENTITY_KEY, roles)
