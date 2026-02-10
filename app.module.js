"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const noop_middleware_1 = require("./middlewares/noop.middleware");
const database_module_1 = require("./core/database/database.module");
const cache_module_1 = require("./core/cache/cache.module");
const auth_module_1 = require("./core/auth/auth.module");
const helper_module_1 = require("./core/helper/helper.module");
const announcement_module_1 = require("./modules/announcement/announcement.module");
const category_module_1 = require("./modules/category/category.module");
const tag_module_1 = require("./modules/tag/tag.module");
const article_module_1 = require("./modules/article/article.module");
const comment_module_1 = require("./modules/comment/comment.module");
const archive_module_1 = require("./modules/archive/archive.module");
const feedback_module_1 = require("./modules/feedback/feedback.module");
const vote_module_1 = require("./modules/vote/vote.module");
const options_module_1 = require("./modules/options/options.module");
const admin_module_1 = require("./modules/admin/admin.module");
const disqus_module_1 = require("./modules/disqus/disqus.module");
const system_module_1 = require("./modules/system/system.module");
const webhook_module_1 = require("./modules/webhook/webhook.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(noop_middleware_1.NoopMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: (0, throttler_1.minutes)(5),
                    limit: 600,
                    ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /baidubot/gi],
                    skipIf: (context) => {
                        const request = context.switchToHttp().getRequest();
                        return (request.hostname === 'localhost' ||
                            request.ip.startsWith('::ffff:127.0.0.1') ||
                            ['127.0.0.1', '::1'].includes(request.ip ?? ''));
                    }
                }
            ]),
            database_module_1.DatabaseModule,
            cache_module_1.CacheModule,
            helper_module_1.HelperModule,
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
            options_module_1.OptionsModule,
            feedback_module_1.FeedbackModule,
            announcement_module_1.AnnouncementModule,
            tag_module_1.TagModule,
            category_module_1.CategoryModule,
            article_module_1.ArticleModule,
            comment_module_1.CommentModule,
            disqus_module_1.DisqusModule,
            archive_module_1.ArchiveModule,
            vote_module_1.VoteModule,
            system_module_1.SystemModule,
            webhook_module_1.WebhookModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard
            }
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map