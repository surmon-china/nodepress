/**
 * @file BIZ extra transformer
 * @module transformer/extra
 * @author Surmon <https://github.com/surmon-china>
 */

import { KeyValueModel } from '@app/models/key-value.model'

export const getExtraObject = (extras: KeyValueModel[]): { [key: string]: string } => {
  return extras.length ? extras.reduce((pv, cv) => ({ ...pv, [cv.key]: cv.value }), {}) : {}
}

export const getExtraValue = (extras: KeyValueModel[], key: string): string | undefined => {
  return extras.length ? getExtraObject(extras)[key] : undefined
}
