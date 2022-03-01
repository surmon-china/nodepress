/**
 * @file BIZ extend transformer
 * @module transformer/extend
 * @author Surmon <https://github.com/surmon-china>
 */

import { KeyValueModel } from '@app/models/key-value.model'

export const getExtendObject = (_extends: KeyValueModel[]): { [key: string]: string } => {
  return _extends.length ? _extends.reduce((v, c) => ({ ...v, [c.name]: c.value }), {}) : {}
}

export const getExtendValue = (_extends: KeyValueModel[], key: string): string | void => {
  return _extends.length ? getExtendObject(_extends)[key] : void 0
}
