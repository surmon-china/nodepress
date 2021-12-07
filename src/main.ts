/**
 * @file App entry
 * @module app/main
 * @author Surmon <https://github.com/surmon-china>
 */

import helmet from 'helmet'
import passport from 'passport'
import bodyParser from 'body-parser'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { AppModule } from '@app/app.module'
import { NestFactory, Reflector } from '@nestjs/core'
import { ValidationPipe } from '@app/pipes/validation.pipe'
import { HttpExceptionFilter } from '@app/filters/error.filter'
import { TransformInterceptor } from '@app/interceptors/transform.interceptor'
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor'
import { ErrorInterceptor } from '@app/interceptors/error.interceptor'
import { environment } from '@app/app.environment'
import logger from '@app/utils/logger'
import * as APP_CONFIG from '@app/app.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false })
  app.use(helmet())
  app.use(compression())
  app.use(bodyParser.json({ limit: '1mb' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(passport.initialize())
  app.use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    new ErrorInterceptor(new Reflector()),
    new LoggingInterceptor()
  )
  return await app.listen(APP_CONFIG.APP.PORT)
}

bootstrap().then(() => {
  logger.info(`NodePress Run！port at ${APP_CONFIG.APP.PORT}, env: ${environment}`)
})
