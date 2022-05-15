"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const logger_1 = __importDefault(require("../../utils/logger"));
const expansion_helper_1 = require("./expansion.helper");
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
        node_schedule_1.default.scheduleJob('1 0 0 * * *', () => {
            (0, expansion_helper_1.resetTodayViewsCount)(this.cacheService).catch((error) => {
                logger_1.default.warn('[expansion]', 'statistic set TODAY_VIEWS Error:', error);
            });
        });
    }
    getStatistic(publicOnly) {
        const resultData = Object.assign({}, DEFAULT_STATISTIC);
        return Promise.all([
            this.tagService.getTotalCount().then((value) => {
                resultData.tags = value;
            }),
            this.articleService.getTotalCount(publicOnly).then((value) => {
                resultData.articles = value;
            }),
            this.commentService.getTotalCount(publicOnly).then((value) => {
                resultData.comments = value;
            }),
            this.articleService.getMetaStatistic().then((value) => {
                resultData.totalViews = value.totalViews;
                resultData.totalLikes = value.totalLikes;
            }),
            (0, expansion_helper_1.getTodayViewsCount)(this.cacheService).then((value) => {
                resultData.todayViews = value;
            }),
            this.feedbackService.getRootFeedbackAverageEmotion().then((value) => {
                resultData.averageEmotion = value;
            }),
        ])
            .then(() => Promise.resolve(resultData))
            .catch(() => Promise.resolve(resultData));
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