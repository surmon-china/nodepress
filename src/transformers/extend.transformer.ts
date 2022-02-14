/**
 * @file BIZ extend transformer
 * @module transformer/extend
 * @author Surmon <https://github.com/surmon-china>
 */

import { ExtendModel } from '@app/models/extend.model'

export const getExtendObject = (_extends: ExtendModel[]): { [key: string]: string } => {
  return _extends.length ? _extends.reduce((v, c) => ({ ...v, [c.name]: c.value }), {}) : {}
}

export const getExtendValue = (_extends: ExtendModel[], key: string): string | void => {
  return _extends.length ? getExtendObject(_extends)[key] : void 0
}
