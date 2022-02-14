/**
 * @file Guest decorator
 * @module decorator/guest
 * @author Surmon <https://github.com/surmon-china>
 */

import { SetMetadata } from '@nestjs/common'
import { reflector } from '@app/constants/reflector.constant'
import { GUEST_REQUEST_METADATA } from '@app/constants/meta.constant'

export interface GuestRequestOption<T = any> {
  only?: T[]
  default?: T
}

export function WhenGuest(option: GuestRequestOption) {
  return (target: any, propertyName: string) => {
    SetMetadata(GUEST_REQUEST_METADATA, {
      ...reflector.get(GUEST_REQUEST_METADATA, target),
      [propertyName]: option,
    })(target)
  }
}

export const getGuestRequestOptions = (target: any): Record<string, GuestRequestOption> => {
  return reflector.get(GUEST_REQUEST_METADATA, target)
}
