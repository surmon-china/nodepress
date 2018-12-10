/**
 * App module.
 * @file App 主模块
 * @module app.module
 * @author Surmon <https://github.com/surmon-china>
 */

import * as appConfig from '@app/app.config';

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppService } from '@app/app.service';

import { CorsMiddleware } from '@app/middlewares/cors.middleware';
import { AuthMiddleware } from '@app/middlewares/auth.middleware';

import { MongooseModule } from '@nestjs/mongoose';
import { GithubModule } from '@app/modules/github/github.module';

@Module({
  imports: [
    // MongooseModule.forRoot(appConfig.MONGODB),
    GithubModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware).forRoutes('*');
    // apply(AuthMiddleware).forRoutes('cats');
  }
}
