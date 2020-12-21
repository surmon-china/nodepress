/**
 * App entry
 * @file Index 入口文件
 * @module app/main
 * @author Surmon <https://github.com/surmon-china>
 */

import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { AppModule } from '@app/app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@app/pipes/validation.pipe';
import { HttpExceptionFilter } from '@app/filters/error.filter';
import { TransformInterceptor } from '@app/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';
import { ErrorInterceptor } from '@app/interceptors/error.interceptor';
import { environment, isProdMode, isDevMode } from '@app/app.environment';
import * as APP_CONFIG from '@app/app.config';

// 解决 Nodejs 环境中请求 HTTPS 的证书授信问题
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 替换 console 为更统一友好的
const { log, warn, info } = console;
const color = c => isDevMode ? c : '';
Object.assign(global.console, {
  log: (...args) => log('[log]', '[nodepress]', ...args),
  warn: (...args) => warn(color('\x1b[33m%s\x1b[0m'), '[warn]', '[nodepress]', ...args),
  info: (...args) => info(color('\x1b[34m%s\x1b[0m'), '[info]', '[nodepress]', ...args),
  error: (...args) => info(color('\x1b[31m%s\x1b[0m'), '[error]', '[nodepress]', ...args),
});

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    isProdMode ? { logger: false } : null,
  );
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
  return await app.listen(APP_CONFIG.APP.PORT);
}

bootstrap().then(() => {
  console.info(`NodePress Run！port at ${APP_CONFIG.APP.PORT}, env: ${environment}`);
});
