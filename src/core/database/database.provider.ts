/**
 * @file Database providers > mongoose connection
 * @module core/database/providers
 * @author Surmon <https://github.com/surmon-china>
 */

import mongoose from 'mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { DB_CONNECTION_TOKEN } from '@app/constants/database.constant'
import { EventKeys } from '@app/constants/events.constant'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'MongoDB', time: isDevEnv })

const DATABASE_RECONNECT_INTERVAL = 6000

export const databaseProvider = {
  inject: [EventEmitter2],
  provide: DB_CONNECTION_TOKEN,
  useFactory: async (eventEmitter: EventEmitter2) => {
    let reconnectionTask: NodeJS.Timeout | null = null

    const connect = () => {
      return mongoose.connect(APP_CONFIG.MONGO_DB.uri, {
        serverSelectionTimeoutMS: 15 * 1000,
        connectTimeoutMS: 10 * 1000
      })
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
      logger.success('connected. (opened)')
      if (reconnectionTask) {
        clearTimeout(reconnectionTask)
        reconnectionTask = null
      }
    })

    mongoose.connection.on('disconnected', () => {
      logger.error(`disconnected! Attempting to reconnect after ${DATABASE_RECONNECT_INTERVAL / 1000}s`)
      eventEmitter.emit(EventKeys.DatabaseError, 'MongoDB disconnected from server.')
      reconnectionTask = setTimeout(connect, DATABASE_RECONNECT_INTERVAL)
    })

    mongoose.connection.on('error', (error) => {
      logger.error('error!', error)
      eventEmitter.emit(EventKeys.DatabaseError, error)
      if (mongoose.connection.readyState !== 0) {
        mongoose.disconnect()
      }
    })

    return await connect()
  }
}
