/**
 * @file BIZ extend transformer
 * @module transformer/extend
 * @author Surmon <https://github.com/surmon-china>
 */

import { Extend } from '@app/models/extend.model'

export const getExtendsObject = (_extends: Extend[]): { [key: string]: string } => {
  return _extends.length ? _extends.reduce((v, c) => ({ ...v, [c.name]: c.value }), {}) : {}
}

export const getExtendValue = (_extends: Extend[], key: string): string | void => {
  return _extends.length ? getExtendsObject(_extends)[key] : void 0
}
