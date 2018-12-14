/**
 * App module.
 * @file App 主模块
 * @module app.module
 * @author Surmon <https://github.com/surmon-china>
 */

import * as appConfig from '@app/app.config';

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';

import { CorsMiddleware } from '@app/middlewares/cors.middleware';
import { OriginMiddleware } from '@app/middlewares/origin.middleware';

import { MongooseModule } from '@nestjs/mongoose';
import { GithubModule } from '@app/modules/github/github.module';
import { AuthModule } from '@app/modules/auth/auth.module';

// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from '@app/utils/jwt.strategy';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register({
    //   secretOrPrivateKey: 'secretKey',
    //   signOptions: {
    //     expiresIn: 3600,
    //   },
    // }),
    // MongooseModule.forRoot(appConfig.MONGODB, {
    //   useCreateIndex: true,
    //   useNewUrlParser: true,
    //   promiseLibrary: global.Promise
    // }),
    GithubModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService /* JwtStrategy */],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
