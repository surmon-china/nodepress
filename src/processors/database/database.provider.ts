/**
 * Database providers.
 * @file Database 模块构造器
 * @module processor/database/providers
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { mongoose } from '@app/transforms/mongoose.transform';
import { DB_CONNECTION_TOKEN } from '@app/constants/system.constant';

export const databaseProvider = {
  provide: DB_CONNECTION_TOKEN,
  useFactory: async () => {

    // 连接数据库
    const connection = () => mongoose.connect(APP_CONFIG.MONGODB.uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      promiseLibrary: global.Promise,
    });

    // 连接错误
    mongoose.connection.on('error', error => {
      const timeout = 6;
      console.warn(`数据库连接失败！将在 ${timeout}s 后重试`, error);
      setTimeout(connection, timeout * 1000);
    });

    // 连接成功
    mongoose.connection.on('open', () => {
      console.log('数据库连接成功！');
    });
    return await connection();
  },
};
