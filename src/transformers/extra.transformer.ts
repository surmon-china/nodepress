/**
 * @file BIZ extra transformer
 * @module transformer/extra
 * @author Surmon <https://github.com/surmon-china>
 */

import { KeyValueModel } from '@app/models/key-value.model'

export const getExtrasMap = (kvs: KeyValueModel[] | void): Map<string, string> => {
  return new Map((kvs ?? []).map((item) => [item.key, item.value]))
}

export const getExtraValue = (extras: KeyValueModel[], key: string) => {
  return extras?.find((extra) => extra.key === key)?.value
}

export const ensureExtra = (extras: KeyValueModel[], key: string, value: any) => {
  if (extras.some((extra) => extra.key === key)) {
    return false
  } else {
    extras.push({ key, value })
    return true
  }
}
