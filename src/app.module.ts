/**
 * App module.
 * @file App 主模块
 * @module app.module
 * @author Surmon <https://github.com/surmon-china>
 */

import * as appConfig from '@app/app.config';

import { Module } from '@nestjs/common';
import { AppService } from '@app/app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { GithubModule } from '@app/modules/github/github.module';

@Module({
  imports: [
    // MongooseModule.forRoot(appConfig.MONGODB),
    GithubModule,
  ],
  providers: [AppService],
})
export class AppModule {}
