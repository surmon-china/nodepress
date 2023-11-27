/**
 * @file Increment ID collection constant
 * @module constant/increment
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementIDOptions } from '@typegoose/auto-increment'

export const GENERAL_AUTO_INCREMENT_ID_CONFIG: AutoIncrementIDOptions = {
  field: 'id',
  startAt: 1,
  incrementBy: 1,
  trackerCollection: 'identitycounters',
  trackerModelName: 'identitycounter'
  // https://github.com/typegoose/auto-increment
  // https://github.com/typegoose/auto-increment/blob/master/src/autoIncrement.ts
  // https://github.com/typegoose/auto-increment/issues/11
  // https://github.com/typegoose/auto-increment#overwritemodelname
  // field: '_id',
  // overwriteModelName: 'modelName',
}
