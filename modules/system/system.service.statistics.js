"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const helper_service_counter_1 = require("../../core/helper/helper.service.counter");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const vote_constant_1 = require("../vote/vote.constant");
const vote_service_1 = require("../vote/vote.service");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("../comment/comment.service");
const feedback_service_1 = require("../feedback/feedback.service");
const tag_service_1 = require("../tag/tag.service");
const cache_constant_1 = require("../../constants/cache.constant");
const email_transformer_1 = require("../../transformers/email.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger = (0, logger_1.createLogger)({ scope: 'StatisticsService', time: app_environment_1.isDevEnv });
const DEFAULT_STATISTICS = Object.freeze({
    tags: null,
    articles: null,
    comments: null,
    totalViews: null,
    totalLikes: null,
    todayViews: null,
    averageEmotion: null
});
let StatisticsService = class StatisticsService {
    emailService;
    counterService;
    articleService;
    commentService;
    feedbackService;
    voteService;
    tagService;
    constructor(emailService, counterService, articleService, commentService, feedbackService, voteService, tagService) {
        this.emailService = emailService;
        this.counterService = counterService;
        this.articleService = articleService;
        this.commentService = commentService;
        this.feedbackService = feedbackService;
        this.voteService = voteService;
        this.tagService = tagService;
    }
    async sendDailyStatisticsEmail() {
        try {
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const createdAt = { $gte: oneDayAgo, $lt: now };
            const [todayViews, todayNewComments, todayArticleUpVotes, todayCommentUpVotes, todayCommentDownVotes] = await Promise.all([
                this.counterService.getGlobalCount(cache_constant_1.CacheKeys.TodayViewCount),
                this.commentService.countDocuments({ created_at: createdAt }),
                this.voteService.countDocuments({
                    created_at: createdAt,
                    target_type: vote_constant_1.VoteTarget.Article,
                    vote_type: vote_constant_1.VoteType.Upvote
                }),
                this.voteService.countDocuments({
                    created_at: createdAt,
                    target_type: vote_constant_1.VoteTarget.Comment,
                    vote_type: vote_constant_1.VoteType.Upvote
                }),
                this.voteService.countDocuments({
                    created_at: createdAt,
                    target_type: vote_constant_1.VoteTarget.Comment,
                    vote_type: vote_constant_1.VoteType.Downvote
                })
            ]);
            this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.NAME, {
                to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
                subject: 'Daily Statistics',
                ...(0, email_transformer_1.linesToEmailContent)([
                    `Today views: ${todayViews}`,
                    `Today new comments: ${todayNewComments}`,
                    `Today new post votes: +${todayArticleUpVotes}`,
                    `Today new comment votes: +${todayCommentUpVotes}, -${todayCommentDownVotes}`
                ])
            });
        }
        finally {
            this.counterService.resetGlobalCount(cache_constant_1.CacheKeys.TodayViewCount).catch((error) => {
                logger.warn('reset TODAY_VIEWS failed!', error);
            });
        }
    }
    getStatistics(publicOnly) {
        const statistics = { ...DEFAULT_STATISTICS };
        const tasks = Promise.all([
            this.tagService.getTotalCount().then((value) => {
                statistics.tags = value;
            }),
            this.articleService.getTotalCount(publicOnly).then((value) => {
                statistics.articles = value;
            }),
            this.commentService.getTotalCount(publicOnly).then((value) => {
                statistics.comments = value;
            }),
            this.feedbackService.getRootFeedbackAverageEmotion().then((value) => {
                statistics.averageEmotion = value ?? 0;
            }),
            this.articleService.getTotalStatistics().then((value) => {
                statistics.totalViews = value?.totalViews ?? 0;
                statistics.totalLikes = value?.totalLikes ?? 0;
            }),
            this.counterService.getGlobalCount(cache_constant_1.CacheKeys.TodayViewCount).then((value) => {
                statistics.todayViews = value;
            })
        ]);
        return tasks
            .then(() => statistics)
            .catch((error) => {
            logger.warn('getStatistics task partial failed!', error);
            return Promise.resolve(statistics);
        });
    }
};
exports.StatisticsService = StatisticsService;
__decorate([
    (0, schedule_1.Cron)('1 0 0 * * *', { name: 'DailyStatisticsJob' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsService.prototype, "sendDailyStatisticsEmail", null);
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService,
        helper_service_counter_1.CounterService,
        article_service_1.ArticleService,
        comment_service_1.CommentService,
        feedback_service_1.FeedbackService,
        vote_service_1.VoteService,
        tag_service_1.TagService])
], StatisticsService);
//# sourceMappingURL=system.service.statistics.js.map