/**
 * App entry.
 * @file Index 入口文件
 * @module app/main
 * @author Surmon <https://github.com/surmon-china>
 */

import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as appConfig from '@app/app.config';
import { AppModule } from '@app/app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@app/pipes/validation.pipe';
import { HttpExceptionFilter } from '@app/filters/error.filter';
import { TransformInterceptor } from '@app/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';
import { ErrorInterceptor } from '@app/interceptors/error.interceptor';
import { isProdMode, isDevMode } from '@app/app.environment';

// 解决 Nodejs 环境中请求 HTTPS 的证书授信问题
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 替换 console 为更统一友好的
const { log, warn, info } = console;
const color = c => isDevMode ? c : '';
global.console = Object.assign(console, {
  log: (...args) => log('[log]', ...args),
  warn: (...args) => warn(color('\x1b[33m%s\x1b[0m'), '[warn]', '[nodepress]', ...args),
  info: (...args) => info(color('\x1b[34m%s\x1b[0m'), '[info]', '[nodepress]', ...args),
  error: (...args) => info(color('\x1b[31m%s\x1b[0m'), '[error]', '[nodepress]', ...args),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, isProdMode ? { logger: false } : null);
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    new ErrorInterceptor(new Reflector()),
    new LoggingInterceptor(),
  );
  return await app.listen(appConfig.APP.PORT);
}

bootstrap().then(_ => {
  console.info(`NodePress Run！port at ${appConfig.APP.PORT}, env: ${appConfig.APP.ENVIRONMENT}`);
});
