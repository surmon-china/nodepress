/**
 * @file App module
 * @module app/module
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyRequest } from 'fastify'
import type { MiddlewareConsumer } from '@nestjs/common'
import { Module, NestModule } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule, minutes } from '@nestjs/throttler'
import { AppController } from '@app/app.controller'

// Framework
import { NoopMiddleware } from '@app/middlewares/noop.middleware'

// Global modules
import { DatabaseModule } from '@app/core/database/database.module'
import { CacheModule } from '@app/core/cache/cache.module'
import { AuthModule } from '@app/core/auth/auth.module'
import { HelperModule } from '@app/core/helper/helper.module'

// BIZ modules
import { AnnouncementModule } from '@app/modules/announcement/announcement.module'
import { CategoryModule } from '@app/modules/category/category.module'
import { TagModule } from '@app/modules/tag/tag.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentModule } from '@app/modules/comment/comment.module'
import { ArchiveModule } from '@app/modules/archive/archive.module'
import { FeedbackModule } from '@app/modules/feedback/feedback.module'
import { VoteModule } from '@app/modules/vote/vote.module'
import { OptionModule } from '@app/modules/option/option.module'
import { AdminModule } from '@app/modules/admin/admin.module'
import { DisqusModule } from '@app/modules/disqus/disqus.module'

// BIZ helper module
import { ExtensionModule } from '@app/modules/extension/extension.module'

@Module({
  imports: [
    // https://github.com/nestjs/throttler#readme
    ThrottlerModule.forRoot([
      {
        ttl: minutes(5), // 5 minutes = 300s
        limit: 600, // 600 limit
        ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /baidubot/gi],
        skipIf: (context) => {
          const request = context.switchToHttp().getRequest<FastifyRequest>()
          // Skip throttle for SSR applications on the same host.
          return (
            request.hostname === 'localhost' ||
            request.ip.startsWith('::ffff:127.0.0.1') ||
            ['127.0.0.1', '::1'].includes(request.ip ?? '')
          )
        }
      }
    ]),
    HelperModule,
    DatabaseModule,
    CacheModule,
    AuthModule,
    ExtensionModule,
    AdminModule,
    OptionModule,
    FeedbackModule,
    AnnouncementModule,
    TagModule,
    CategoryModule,
    ArticleModule,
    CommentModule,
    DisqusModule,
    ArchiveModule,
    VoteModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NoopMiddleware).forRoutes('*')
  }
}
