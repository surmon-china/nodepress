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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cache_service_1 = require("../../processors/cache/cache.service");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("../comment/comment.service");
const feedback_service_1 = require("../feedback/feedback.service");
const tag_service_1 = require("../tag/tag.service");
const CACHE_KEY = __importStar(require("../../constants/cache.constant"));
const logger_1 = __importDefault(require("../../utils/logger"));
const DEFAULT_STATISTIC = Object.freeze({
    tags: null,
    articles: null,
    comments: null,
    totalViews: null,
    totalLikes: null,
    todayViews: null,
    averageEmotion: null,
});
let StatisticService = class StatisticService {
    constructor(cacheService, articleService, commentService, feedbackService, tagService) {
        this.cacheService = cacheService;
        this.articleService = articleService;
        this.commentService = commentService;
        this.feedbackService = feedbackService;
        this.tagService = tagService;
        this.resultData = Object.assign({}, DEFAULT_STATISTIC);
        node_schedule_1.default.scheduleJob('1 0 0 * * *', () => {
            this.cacheService.set(CACHE_KEY.TODAY_VIEWS, 0).catch((error) => {
                logger_1.default.warn('[expansion]', 'statistic set TODAY_VIEWS Error:', error);
            });
        });
    }
    async getTodayViewsCount() {
        const views = await this.cacheService.get(CACHE_KEY.TODAY_VIEWS);
        this.resultData.todayViews = views || 0;
    }
    async getArticlesStatistic() {
        const meta = await this.articleService.getMetaStatistic();
        this.resultData.totalViews = meta.totalViews;
        this.resultData.totalLikes = meta.totalLikes;
    }
    async getArticlesCount(publicOnly) {
        this.resultData.articles = await this.articleService.getTotalCount(publicOnly);
    }
    async getTagsCount() {
        this.resultData.tags = await this.tagService.getTotalCount();
    }
    async getCommentsCount(publicOnly) {
        this.resultData.comments = await this.commentService.getTotalCount(publicOnly);
    }
    async getAverageEmotion() {
        this.resultData.averageEmotion = await this.feedbackService.getRootFeedbackAverageEmotion();
    }
    getStatistic(publicOnly) {
        return Promise.all([
            this.getTagsCount(),
            this.getArticlesCount(publicOnly),
            this.getCommentsCount(publicOnly),
            this.getAverageEmotion(),
            this.getArticlesStatistic(),
            this.getTodayViewsCount(),
        ])
            .then(() => Promise.resolve(this.resultData))
            .catch(() => Promise.resolve(this.resultData));
    }
};
StatisticService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        article_service_1.ArticleService,
        comment_service_1.CommentService,
        feedback_service_1.FeedbackService,
        tag_service_1.TagService])
], StatisticService);
exports.StatisticService = StatisticService;
//# sourceMappingURL=expansion.service.statistic.js.map