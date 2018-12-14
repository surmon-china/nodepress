/**
 * App entry module.
 * @file Index 入口文件
 * @module app.main
 * @author Surmon <https://github.com/surmon-china>
 */

import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as rateLimit from 'express-rate-limit';
import * as appConfig from '@app/app.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { ErrorFilter } from '@app/filters/error.filter';
import { TransformInterceptor } from '@app/interceptors/transform.interceptor';
import { ErrorInterceptor } from '@app/interceptors/error.interceptor';
import { Reflector } from '@nestjs/core';
import { consola } from '@app/transforms/module.transform';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(rateLimit({ max: 100, windowMs: 15 * 60 * 1000 }));
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()), new ErrorInterceptor(new Reflector()));
  return await app.listen(appConfig.APP.PORT);
}

bootstrap().then(_ => {
  consola.ready(`NodePress Run！port at ${appConfig.APP.PORT}, env: ${appConfig.APP.ENVIRONMENT}`);
});
