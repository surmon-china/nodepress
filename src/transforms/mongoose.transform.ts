/**
 * App module transform.
 * @file 模块转换器
 * @module app.utils.module.transform
 * @author Surmon <https://github.com/surmon-china>
 */

import * as _mongoose from 'mongoose';
import * as _mongoosePaginate from 'mongoose-paginate';
import * as _mongooseAutoIncrement from 'mongoose-auto-increment';
import * as appConfig from '@app/app.config';

// remove DeprecationWarning
_mongoose.set('useFindAndModify', false);

// plugin options
_mongoosePaginate.paginate.options = {
  limit: appConfig.APP.LIMIT,
};

// mongoose Promise
_mongoose.Promise = global.Promise;

// 自增 ID 初始化
_mongooseAutoIncrement.initialize(_mongoose.connection);

// export
export const mongoose = _mongoose;
export const mongoosePaginate = _mongoosePaginate;
export const mongooseAutoIncrement = _mongooseAutoIncrement;
export default mongoose;
