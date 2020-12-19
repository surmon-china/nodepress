/**
 * Database providers.
 * @file Database 模块构造器
 * @module processor/database/providers
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { mongoose } from '@app/transformers/mongoose.transformer';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { DB_CONNECTION_TOKEN } from '@app/constants/system.constant';

export const databaseProvider = {
  inject: [EmailService],
  provide: DB_CONNECTION_TOKEN,
  useFactory: async (emailService: EmailService) => {

    let reconnectionTask = null;
    const RECONNECT_INTERVAL = 6000;

    // 发送告警邮件（当发送邮件时，数据库已达到万劫不复之地）
    const sendAlarmMail = (error: string) => {
      emailService.sendMail({
        to: APP_CONFIG.EMAIL.admin,
        subject: `${APP_CONFIG.APP.NAME} 数据库发生异常！`,
        text: error,
        html: `<pre><code>${error}</code></pre>`,
      });
    };

    // 连接数据库
    function connection() {
      return mongoose.connect(APP_CONFIG.MONGO_DB.uri, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        promiseLibrary: global.Promise
      });
    }

    mongoose.connection.on('connecting', () => {
      console.log('数据库连接中...');
    });

    mongoose.connection.on('open', () => {
      console.info('数据库连接成功！');
      clearTimeout(reconnectionTask);
      reconnectionTask = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.error(`数据库失去连接！尝试 ${RECONNECT_INTERVAL / 1000}s 后重连`);
      reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
    });

    mongoose.connection.on('error', error => {
      console.error('数据库发生异常！', error);
      mongoose.disconnect();
      sendAlarmMail(String(error));
    });

    return await connection();
  },
};
