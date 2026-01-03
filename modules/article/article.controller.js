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
const trim_1 = __importDefault(require("lodash/trim"));
const isInteger_1 = __importDefault(require("lodash/isInteger"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const admin_optional_guard_1 = require("../../guards/admin-optional.guard");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const biz_constant_1 = require("../../constants/biz.constant");
const cache_service_1 = require("../../core/cache/cache.service");
const tag_service_1 = require("../tag/tag.service");
const category_service_1 = require("../category/category.service");
const extension_helper_1 = require("../extension/extension.helper");
const article_dto_1 = require("./article.dto");
const article_model_1 = require("./article.model");
const article_service_1 = require("./article.service");
const article_model_2 = require("./article.model");
let ArticleController = class ArticleController {
    tagService;
    categoryService;
    articleService;
    cacheService;
    constructor(tagService, categoryService, articleService, cacheService) {
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.articleService = articleService;
        this.cacheService = cacheService;
    }
    async getArticles(query) {
        const { page, per_page, sort, ...filters } = query;
        const queryFilter = {};
        const paginateOptions = { page, perPage: per_page };
        if (!(0, isUndefined_1.default)(sort)) {
            if (sort === biz_constant_1.SortType.Hottest) {
                paginateOptions.sort = article_model_1.ARTICLE_HOTTEST_SORT_PARAMS;
            }
            else {
                paginateOptions.dateSort = sort;
            }
        }
        if (!(0, isUndefined_1.default)(filters.featured)) {
            queryFilter.featured = filters.featured;
        }
        if (!(0, isUndefined_1.default)(filters.lang)) {
            queryFilter.lang = filters.lang;
        }
        if (!(0, isUndefined_1.default)(filters.state)) {
            queryFilter.state = filters.state;
        }
        if (!(0, isUndefined_1.default)(filters.public)) {
            queryFilter.public = filters.public;
        }
        if (!(0, isUndefined_1.default)(filters.origin)) {
            queryFilter.origin = filters.origin;
        }
        if (filters.keyword) {
            const trimmed = (0, trim_1.default)(filters.keyword);
            const keywordRegExp = new RegExp(trimmed, 'i');
            queryFilter.$or = [{ title: keywordRegExp }, { content: keywordRegExp }, { description: keywordRegExp }];
        }
        if (filters.date) {
            const queryDateMS = new Date(filters.date).getTime();
            queryFilter.created_at = {
                $gte: new Date((queryDateMS / 1000 - 60 * 60 * 8) * 1000),
                $lt: new Date((queryDateMS / 1000 + 60 * 60 * 16) * 1000)
            };
        }
        if (filters.tag_slug) {
            const tag = await this.tagService.getDetailBySlug(filters.tag_slug);
            queryFilter.tags = tag._id;
        }
        if (filters.category_slug) {
            const category = await this.categoryService.getDetailBySlug(filters.category_slug);
            queryFilter.categories = category._id;
        }
        return this.articleService.paginate(queryFilter, paginateOptions);
    }
    getArticleCalendar(query, { isUnauthenticated }) {
        return this.articleService.getCalendar(isUnauthenticated, query.timezone);
    }
    async getArticleContext({ params }) {
        const articleId = Number(params.id);
        const [prevArticles, nextArticles, relatedArticles] = await Promise.all([
            this.articleService.getNearArticles(articleId, 'early', 1),
            this.articleService.getNearArticles(articleId, 'later', 1),
            this.articleService
                .getDetailByNumberIdOrSlug({ numberId: articleId, publicOnly: true, lean: true })
                .then((article) => this.articleService.getRelatedArticles(article, 20))
        ]);
        return {
            prev_article: prevArticles?.[0] || null,
            next_article: nextArticles?.[0] || null,
            related_articles: relatedArticles || []
        };
    }
    async getArticle({ params, isUnauthenticated }) {
        if (isUnauthenticated) {
            const isNumberTypeId = (0, isInteger_1.default)(Number(params.id));
            const article = await this.articleService.getDetailByNumberIdOrSlug({
                numberId: isNumberTypeId ? Number(params.id) : undefined,
                slug: isNumberTypeId ? undefined : String(params.id),
                publicOnly: true,
                populate: true,
                lean: true
            });
            this.articleService.incrementMetaStatistic(article.id, 'views');
            (0, extension_helper_1.incrementGlobalTodayViewsCount)(this.cacheService);
            return article;
        }
        return mongoose_1.Types.ObjectId.isValid(params.id)
            ? this.articleService.getDetailByObjectId(params.id)
            : this.articleService.getDetailByNumberIdOrSlug({ numberId: Number(params.id), lean: true });
    }
    createArticle(article) {
        return this.articleService.create(article);
    }
    putArticle({ params }, article) {
        return this.articleService.update(params.id, article);
    }
    delArticle({ params }) {
        return this.articleService.delete(params.id);
    }
    patchArticles(body) {
        return this.articleService.batchPatchState(body.article_ids, body.state);
    }
    delArticles(body) {
        return this.articleService.batchDelete(body.article_ids);
    }
};
exports.ArticleController = ArticleController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get articles succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticlePaginateQueryDTO]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticles", null);
__decorate([
    (0, common_1.Get)('calendar'),
    (0, common_1.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get article calendar succeeded'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticleCalendarQueryDTO, Object]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "getArticleCalendar", null);
__decorate([
    (0, common_1.Get)(':id/context'),
    (0, success_response_decorator_1.SuccessResponse)('Get context articles succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticleContext", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get article detail succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticle", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Create article succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_model_2.Article]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "createArticle", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update article succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, article_model_2.Article]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "putArticle", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete article succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "delArticle", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update articles succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticlesStateDTO]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "patchArticles", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete articles succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticleIdsDTO]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "delArticles", null);
exports.ArticleController = ArticleController = __decorate([
    (0, common_1.Controller)('article'),
    __metadata("design:paramtypes", [tag_service_1.TagService,
        category_service_1.CategoryService,
        article_service_1.ArticleService,
        cache_service_1.CacheService])
], ArticleController);
//# sourceMappingURL=article.controller.js.map