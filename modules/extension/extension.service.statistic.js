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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticService = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../../core/cache/cache.service");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const vote_model_1 = require("../vote/vote.model");
const vote_service_1 = require("../vote/vote.service");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("../comment/comment.service");
const feedback_service_1 = require("../feedback/feedback.service");
const tag_service_1 = require("../tag/tag.service");
const extension_helper_1 = require("./extension.helper");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger = (0, logger_1.createLogger)({ scope: 'StatisticService', time: app_environment_1.isDevEnv });
const DEFAULT_STATISTIC = Object.freeze({
    tags: null,
    articles: null,
    comments: null,
    totalViews: null,
    totalLikes: null,
    todayViews: null,
    averageEmotion: null
});
let StatisticService = class StatisticService {
    cacheService;
    emailService;
    articleService;
    commentService;
    feedbackService;
    voteService;
    tagService;
    constructor(cacheService, emailService, articleService, commentService, feedbackService, voteService, tagService) {
        this.cacheService = cacheService;
        this.emailService = emailService;
        this.articleService = articleService;
        this.commentService = commentService;
        this.feedbackService = feedbackService;
        this.voteService = voteService;
        this.tagService = tagService;
        node_schedule_1.default.scheduleJob('1 0 0 * * *', async () => {
            try {
                const todayViewsCount = await (0, extension_helper_1.getTodayViewsCount)(this.cacheService);
                await this.dailyStatisticsTask(todayViewsCount);
            }
            finally {
                (0, extension_helper_1.resetTodayViewsCount)(this.cacheService).catch((error) => {
                    logger.warn('reset TODAY_VIEWS failed!', error);
                });
            }
        });
    }
    async dailyStatisticsTask(todayViews) {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const createdAt = { $gte: oneDayAgo, $lt: now };
        const [todayNewComments, todayArticleUpVotes, todayCommentUpVotes, todayCommentDownVotes] = await Promise.all([
            this.commentService.countDocuments({ created_at: createdAt }),
            this.voteService.countDocuments({
                created_at: createdAt,
                target_type: vote_model_1.VoteTarget.Post,
                vote_type: vote_model_1.VoteType.Upvote
            }),
            this.voteService.countDocuments({
                created_at: createdAt,
                target_type: vote_model_1.VoteTarget.Comment,
                vote_type: vote_model_1.VoteType.Upvote
            }),
            this.voteService.countDocuments({
                created_at: createdAt,
                target_type: vote_model_1.VoteTarget.Comment,
                vote_type: vote_model_1.VoteType.Downvote
            })
        ]);
        const emailContents = [
            `Today views: ${todayViews}`,
            `Today new comments: ${todayNewComments}`,
            `Today new post votes: +${todayArticleUpVotes}`,
            `Today new comment votes: +${todayCommentUpVotes}, -${todayCommentDownVotes}`
        ];
        this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.NAME, {
            to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
            subject: 'Daily Statistics',
            text: emailContents.join('\n'),
            html: emailContents.map((text) => `<p>${text}</p>`).join('\n')
        });
    }
    getStatistic(publicOnly) {
        const statisticData = { ...DEFAULT_STATISTIC };
        const tasks = Promise.all([
            this.tagService.getTotalCount().then((value) => {
                statisticData.tags = value;
            }),
            this.articleService.getTotalCount(publicOnly).then((value) => {
                statisticData.articles = value;
            }),
            this.commentService.getTotalCount(publicOnly).then((value) => {
                statisticData.comments = value;
            }),
            this.feedbackService.getRootFeedbackAverageEmotion().then((value) => {
                statisticData.averageEmotion = value ?? 0;
            }),
            this.articleService.getMetaStatistic().then((value) => {
                statisticData.totalViews = value?.totalViews ?? 0;
                statisticData.totalLikes = value?.totalLikes ?? 0;
            }),
            (0, extension_helper_1.getTodayViewsCount)(this.cacheService).then((value) => {
                statisticData.todayViews = value;
            })
        ]);
        return tasks
            .then(() => statisticData)
            .catch((error) => {
            logger.warn('getStatistic task partial failed!', error);
            return Promise.resolve(statisticData);
        });
    }
};
exports.StatisticService = StatisticService;
exports.StatisticService = StatisticService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        helper_service_email_1.EmailService,
        article_service_1.ArticleService,
        comment_service_1.CommentService,
        feedback_service_1.FeedbackService,
        vote_service_1.VoteService,
        tag_service_1.TagService])
], StatisticService);
//# sourceMappingURL=extension.service.statistic.js.map