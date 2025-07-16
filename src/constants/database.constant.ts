/**
 * @file Database constant
 * @module constant/databse
 * @author Surmon <https://github.com/surmon-china>
 */

import type { AutoIncrementIDOptions } from '@typegoose/auto-increment'

export const DB_CONNECTION_TOKEN = 'DBConnectionToken'
export const DB_MODEL_TOKEN_SUFFIX = 'ModelToken'

export const GENERAL_DB_AUTO_INCREMENT_ID_CONFIG: AutoIncrementIDOptions = {
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
