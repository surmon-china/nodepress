/**
 * App module transform.
 * @file 模块转换器
 * @module app.utils.module.transform
 * @author Surmon <https://github.com/surmon-china>
 */

import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import * as autoIncrement from 'mongoose-auto-increment';
import * as appConfig from '@app/app.config';

// remove DeprecationWarning
mongoose.set('useFindAndModify', false);

// plugin options
mongoosePaginate.paginate.options = {
  limit: appConfig.APP.LIMIT,
};

// mongoose Promise
mongoose.Promise = global.Promise;

// 自增 ID 初始化
autoIncrement.initialize(mongoose.connection);

// export
export const Mongoose = mongoose;
export const MongoosePaginate = mongoosePaginate;
export const MongooseAutoIncrement = autoIncrement;
export default mongoose;
