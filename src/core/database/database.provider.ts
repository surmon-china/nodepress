/**
 * @file Database providers > mongoose connection
 * @module core/database/providers
 * @author Surmon <https://github.com/surmon-china>
 */

import mongoose from 'mongoose'
import { DB_CONNECTION_TOKEN } from '@app/constants/database.constant'
import { EmailService } from '@app/core/helper/helper.service.email'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'MongoDB', time: isDevEnv })

export const databaseProvider = {
  inject: [EmailService],
  provide: DB_CONNECTION_TOKEN,
  useFactory: async (emailService: EmailService) => {
    let reconnectionTask: NodeJS.Timeout | null = null
    const RECONNECT_INTERVAL = 6000

    const sendAlarmMail = (error: string) => {
      emailService.sendMailAs(APP_CONFIG.APP_BIZ.NAME, {
        to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
        subject: `MongoDB Error!`,
        text: error,
        html: `<pre><code>${error}</code></pre>`
      })
    }

    const connection = () => {
      return mongoose.connect(APP_CONFIG.MONGO_DB.uri, {})
    }

    // DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7.
    // Use `mongoose.set('strictQuery', false);` if you want to prepare for this change.
    // Or use `mongoose.set('strictQuery', true);` to suppress this warning.
    // https://mongoosejs.com/docs/guide.html#strictQuery
    mongoose.set('strictQuery', false)

    mongoose.connection.on('connecting', () => {
      logger.log('connecting...')
    })

    mongoose.connection.on('open', () => {
      logger.success('readied (open).')
      if (reconnectionTask) {
        clearTimeout(reconnectionTask)
        reconnectionTask = null
      }
    })

    mongoose.connection.on('disconnected', () => {
      logger.error(`disconnected! retry after ${RECONNECT_INTERVAL / 1000}s`)
      reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL)
    })

    mongoose.connection.on('error', (error) => {
      logger.error('error!', error)
      mongoose.disconnect()
      sendAlarmMail(String(error))
    })

    return await connection()
  }
}
