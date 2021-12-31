/**
 * @file Database providers > mongoose connection
 * @module processor/database/providers
 * @author Surmon <https://github.com/surmon-china>
 */

import mongoose from 'mongoose'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { DB_CONNECTION_TOKEN } from '@app/constants/system.constant'
import * as APP_CONFIG from '@app/app.config'
import logger from '@app/utils/logger'

export const databaseProvider = {
  inject: [EmailService],
  provide: DB_CONNECTION_TOKEN,
  useFactory: async (emailService: EmailService) => {
    let reconnectionTask: NodeJS.Timeout | null = null
    const RECONNECT_INTERVAL = 6000

    // 发送告警邮件（当发送邮件时，数据库已达到万劫不复之地）
    const sendAlarmMail = (error: string) => {
      emailService.sendMail({
        to: APP_CONFIG.EMAIL.admin,
        subject: `${APP_CONFIG.APP.NAME} 数据库发生异常！`,
        text: error,
        html: `<pre><code>${error}</code></pre>`,
      })
    }

    // 连接数据库
    function connection() {
      return mongoose.connect(APP_CONFIG.MONGO_DB.uri)
    }

    mongoose.connection.on('connecting', () => {
      logger.info('[MongoDB]', 'connecting...')
    })

    mongoose.connection.on('open', () => {
      logger.info('[MongoDB]', 'readied!')
      if (reconnectionTask) {
        clearTimeout(reconnectionTask)
        reconnectionTask = null
      }
    })

    mongoose.connection.on('disconnected', () => {
      logger.error('[MongoDB]', `disconnected! 尝试 ${RECONNECT_INTERVAL / 1000}s 后重连`)
      reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL)
    })

    mongoose.connection.on('error', (error) => {
      logger.error('[MongoDB]', 'error!', error)
      mongoose.disconnect()
      sendAlarmMail(String(error))
    })

    return await connection()
  },
}
