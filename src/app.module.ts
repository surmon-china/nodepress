/**
 * App module.
 * @file App 主模块
 * @module app.module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import * as appConfig from '@app/app.config';

@Module({
  imports: [TypeOrmModule.forRoot(appConfig.MONGODB)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
