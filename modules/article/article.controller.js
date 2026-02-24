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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const event_emitter_1 = require("@nestjs/event-emitter");
const common_1 = require("@nestjs/common");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const events_constant_1 = require("../../constants/events.constant");
const cache_constant_1 = require("../../constants/cache.constant");
const sort_constant_1 = require("../../constants/sort.constant");
const helper_service_counter_1 = require("../../core/helper/helper.service.counter");
const category_service_1 = require("../category/category.service");
const tag_service_1 = require("../tag/tag.service");
const article_dto_1 = require("./article.dto");
const article_dto_2 = require("./article.dto");
const article_constant_1 = require("./article.constant");
const article_service_context_1 = require("./article.service.context");
const article_service_stats_1 = require("./article.service.stats");
const article_service_1 = require("./article.service");
let ArticleController = class ArticleController {
    eventEmitter;
    counterService;
    tagService;
    categoryService;
    articleService;
    articleContextService;
    articleStatsService;
    constructor(eventEmitter, counterService, tagService, categoryService, articleService, articleContextService, articleStatsService) {
        this.eventEmitter = eventEmitter;
        this.counterService = counterService;
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.articleService = articleService;
        this.articleContextService = articleContextService;
        this.articleStatsService = articleStatsService;
    }
    async getArticles(query) {
        const { page, per_page, sort, ...filters } = query;
        const queryFilter = {};
        const paginateOptions = { page, perPage: per_page };
        if (!(0, isUndefined_1.default)(sort)) {
            if (sort === sort_constant_1.SortMode.Hottest) {
                paginateOptions.sort = article_constant_1.ARTICLE_HOTTEST_SORT_CONFIG;
            }
            else {
                paginateOptions.dateSort = sort;
            }
        }
        if (!(0, isUndefined_1.default)(filters.status)) {
            queryFilter.status = filters.status;
        }
        if (!(0, isUndefined_1.default)(filters.origin)) {
            queryFilter.origin = filters.origin;
        }
        if (!(0, isUndefined_1.default)(filters.featured)) {
            queryFilter.featured = filters.featured;
        }
        if (!(0, isUndefined_1.default)(filters.lang)) {
            queryFilter.lang = filters.lang;
        }
        if (filters.keyword) {
            const keywordRegExp = new RegExp(filters.keyword, 'i');
            queryFilter.$or = [{ title: keywordRegExp }, { content: keywordRegExp }, { summary: keywordRegExp }];
        }
        if (filters.date) {
            const queryDateMS = new Date(filters.date).getTime();
            queryFilter.created_at = {
                $gte: new Date((queryDateMS / 1000 - 60 * 60 * 8) * 1000),
                $lt: new Date((queryDateMS / 1000 + 60 * 60 * 16) * 1000)
            };
        }
        if (filters.tag_slug) {
            const tag = await this.tagService.getDetail(filters.tag_slug);
            queryFilter.tags = tag._id;
        }
        if (filters.category_slug) {
            const category = await this.categoryService.getDetail(filters.category_slug);
            queryFilter.categories = category._id;
        }
        return this.articleService.paginate(queryFilter, paginateOptions);
    }
    getAllArticles() {
        return this.articleService.getAll();
    }
    getArticlesCalendar({ timezone }, { identity }) {
        return this.articleStatsService.getCalendar(!identity.isAdmin, timezone);
    }
    async getArticle(id, { identity }) {
        const article = await this.articleService.getDetail(id, {
            publicOnly: !identity.isAdmin,
            populate: !identity.isAdmin,
            lean: true
        });
        if (!identity.isAdmin) {
            this.articleStatsService.incrementStatistics(article.id, 'views');
            this.counterService.incrementGlobalCount(cache_constant_1.CacheKeys.TodayViewCount);
        }
        return article;
    }
    async getArticleContext(articleId, { related_count }) {
        const [prevArticles, nextArticles, relatedArticles] = await Promise.all([
            this.articleContextService.getNearArticles(articleId, 'early', 1),
            this.articleContextService.getNearArticles(articleId, 'later', 1),
            this.articleService
                .getDetail(articleId, { publicOnly: true, lean: true })
                .then((article) => this.articleContextService.getRelatedArticles(article, related_count ?? 10))
        ]);
        return {
            prev_article: prevArticles?.[0] || null,
            next_article: nextArticles?.[0] || null,
            related_articles: relatedArticles || []
        };
    }
    async createArticle(dto) {
        const created = await this.articleService.create(dto);
        this.eventEmitter.emit(events_constant_1.EventKeys.ArticleCreated, created);
        return created;
    }
    async updateArticle(id, dto) {
        const updated = await this.articleService.update(id, dto);
        this.eventEmitter.emit(events_constant_1.EventKeys.ArticleUpdated, updated);
        return updated;
    }
    async deleteArticle(id) {
        const result = await this.articleService.delete(id);
        this.eventEmitter.emit(events_constant_1.EventKeys.ArticleDeleted, result);
        return result;
    }
    updateArticlesStatus(dto) {
        return this.articleService.batchUpdateStatus(dto.article_ids, dto.status);
    }
    deleteArticles({ article_ids }) {
        return this.articleService.batchDelete(article_ids);
    }
};
exports.ArticleController = ArticleController;
__decorate([
    (0, common_1.Get)(),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get articles succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticlePaginateQueryDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticles", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Get all articles succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "getAllArticles", null);
__decorate([
    (0, common_1.Get)('calendar'),
    (0, success_response_decorator_1.SuccessResponse)('Get articles calendar succeeded'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticleCalendarQueryDto, Object]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "getArticlesCalendar", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, success_response_decorator_1.SuccessResponse)('Get article detail succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticle", null);
__decorate([
    (0, common_1.Get)(':id/context'),
    (0, success_response_decorator_1.SuccessResponse)('Get context articles succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, article_dto_1.ArticleContextQueryDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticleContext", null);
__decorate([
    (0, common_1.Post)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Create article succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_2.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "createArticle", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update article succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, article_dto_2.UpdateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "updateArticle", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete article succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "deleteArticle", null);
__decorate([
    (0, common_1.Patch)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update articles succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_2.ArticleIdsStatusDto]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "updateArticlesStatus", null);
__decorate([
    (0, common_1.Delete)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete articles succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_2.ArticleIdsDto]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "deleteArticles", null);
exports.ArticleController = ArticleController = __decorate([
    (0, common_1.Controller)('articles'),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        helper_service_counter_1.CounterService,
        tag_service_1.TagService,
        category_service_1.CategoryService,
        article_service_1.ArticleService,
        article_service_context_1.ArticleContextService,
        article_service_stats_1.ArticleStatsService])
], ArticleController);
//# sourceMappingURL=article.controller.js.map