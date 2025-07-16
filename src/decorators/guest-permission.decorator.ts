/**
 * @file Guest request field-level permission decorator
 * @module decorator/guest-permission
 * @author Surmon
 */

import { SetMetadata } from '@nestjs/common'
import { reflector } from '@app/constants/reflector.constant'

export interface GuestRequestPermission<T = any> {
  only?: T[]
  default?: T
}

const METADATA_GUEST_PERMISSION_PREFIX = 'app:guest_request_permission'

export const getGuestRequestPermission = (target: any, propertyKey: string): GuestRequestPermission | undefined => {
  return reflector.get(`${METADATA_GUEST_PERMISSION_PREFIX}:${propertyKey}`, target)
}

export function WithGuestPermission(permission: GuestRequestPermission) {
  return (target: any, propertyKey: string) => {
    SetMetadata(`${METADATA_GUEST_PERMISSION_PREFIX}:${propertyKey}`, permission)(target)
  }
}
