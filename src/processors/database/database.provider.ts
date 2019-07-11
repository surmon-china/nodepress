/**
 * Database providers.
 * @file Database 模块构造器
 * @module processor/database/providers
 * @author Surmon <https://github.com/surmon-china>
 */

import * as lodash from 'lodash';
import * as APP_CONFIG from '@app/app.config';
import { mongoose } from '@app/transforms/mongoose.transform';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { DB_CONNECTION_TOKEN } from '@app/constants/system.constant';

export const databaseProvider = {
  inject: [EmailService],
  provide: DB_CONNECTION_TOKEN,
  useFactory: async (emailService: EmailService) => {

    const RECONNET_INTERVAL = 6000;

    // 发送告警邮件（18 秒节流）
    const sendAlarmMail = lodash.throttle((error: string) => {
      emailService.sendMail({
        to: APP_CONFIG.EMAIL.admin,
        subject: `${APP_CONFIG.APP.NAME} 数据库发生异常！`,
        text: error,
        html: `<pre><code>${error}</code></pre>`,
      });
    }, RECONNET_INTERVAL * 3);

    // 连接数据库
    function connection() {
      return mongoose.connect(APP_CONFIG.MONGODB.uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        autoReconnect: true,
        reconnectInterval: RECONNET_INTERVAL,
      }, error => {});
    }

    mongoose.connection.on('connecting', () => {
      console.log('数据库连接中...');
    });

    mongoose.connection.on('open', () => {
      console.info('数据库连接成功！');
    });

    mongoose.connection.on('disconnected', () => {
      console.error(`数据库失去连接！尝试 ${RECONNET_INTERVAL / 1000}s 后重连`);
      setTimeout(connection, RECONNET_INTERVAL);
    });

    mongoose.connection.on('error', error => {
      console.error('数据库发生异常！', error);
      mongoose.disconnect();
      sendAlarmMail(String(error));
    });

    return await connection();
  },
};
