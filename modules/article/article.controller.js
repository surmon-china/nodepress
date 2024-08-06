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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const trim_1 = __importDefault(require("lodash/trim"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const responser_decorator_1 = require("../../decorators/responser.decorator");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_maybe_guard_1 = require("../../guards/admin-maybe.guard");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const expose_pipe_1 = require("../../pipes/expose.pipe");
const biz_constant_1 = require("../../constants/biz.constant");
const tag_service_1 = require("../tag/tag.service");
const category_service_1 = require("../category/category.service");
const article_dto_1 = require("./article.dto");
const article_model_1 = require("./article.model");
const article_service_1 = require("./article.service");
const article_model_2 = require("./article.model");
let ArticleController = class ArticleController {
    constructor(tagService, categoryService, articleService) {
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.articleService = articleService;
    }
    async getArticles(query) {
        const { page, per_page, sort } = query, filters = __rest(query, ["page", "per_page", "sort"]);
        const paginateQuery = {};
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
            paginateQuery.featured = filters.featured;
        }
        if (!(0, isUndefined_1.default)(filters.lang)) {
            paginateQuery.lang = filters.lang;
        }
        if (!(0, isUndefined_1.default)(filters.state)) {
            paginateQuery.state = filters.state;
        }
        if (!(0, isUndefined_1.default)(filters.public)) {
            paginateQuery.public = filters.public;
        }
        if (!(0, isUndefined_1.default)(filters.origin)) {
            paginateQuery.origin = filters.origin;
        }
        if (filters.keyword) {
            const trimmed = (0, trim_1.default)(filters.keyword);
            const keywordRegExp = new RegExp(trimmed, 'i');
            paginateQuery.$or = [{ title: keywordRegExp }, { content: keywordRegExp }, { description: keywordRegExp }];
        }
        if (filters.date) {
            const queryDateMS = new Date(filters.date).getTime();
            paginateQuery.created_at = {
                $gte: new Date((queryDateMS / 1000 - 60 * 60 * 8) * 1000),
                $lt: new Date((queryDateMS / 1000 + 60 * 60 * 16) * 1000)
            };
        }
        if (filters.tag_slug) {
            const tag = await this.tagService.getDetailBySlug(filters.tag_slug);
            paginateQuery.tags = tag._id;
        }
        if (filters.category_slug) {
            const category = await this.categoryService.getDetailBySlug(filters.category_slug);
            paginateQuery.categories = category._id;
        }
        return this.articleService.paginator(paginateQuery, paginateOptions);
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
                .getDetailByNumberIdOrSlug({ idOrSlug: articleId, publicOnly: true })
                .then((article) => this.articleService.getRelatedArticles(article, 20))
        ]);
        return {
            prev_article: (prevArticles === null || prevArticles === void 0 ? void 0 : prevArticles[0]) || null,
            next_article: (nextArticles === null || nextArticles === void 0 ? void 0 : nextArticles[0]) || null,
            related_articles: relatedArticles || []
        };
    }
    getArticle({ params, isUnauthenticated }) {
        if (isUnauthenticated) {
            const idOrSlug = isNaN(Number(params.id)) ? String(params.id) : Number(params.id);
            return this.articleService.getFullDetailForGuest(idOrSlug);
        }
        return mongoose_1.Types.ObjectId.isValid(params.id)
            ? this.articleService.getDetailByObjectId(params.id)
            : this.articleService.getDetailByNumberIdOrSlug({ idOrSlug: Number(params.id) });
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
    (0, common_1.UseGuards)(admin_maybe_guard_1.AdminMaybeGuard),
    responser_decorator_1.Responser.paginate(),
    responser_decorator_1.Responser.handle('Get articles'),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe, expose_pipe_1.ExposePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticlePaginateQueryDTO]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticles", null);
__decorate([
    (0, common_1.Get)('calendar'),
    (0, common_1.UseGuards)(admin_maybe_guard_1.AdminMaybeGuard),
    responser_decorator_1.Responser.handle('Get article calendar'),
    __param(0, (0, common_1.Query)(expose_pipe_1.ExposePipe)),
    __param(1, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticleCalendarQueryDTO, Object]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "getArticleCalendar", null);
__decorate([
    (0, common_1.Get)(':id/context'),
    responser_decorator_1.Responser.handle('Get context articles'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticleContext", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(admin_maybe_guard_1.AdminMaybeGuard),
    responser_decorator_1.Responser.handle({
        message: 'Get article detail',
        error: common_1.HttpStatus.NOT_FOUND
    }),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticle", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Create article'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_model_2.Article]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "createArticle", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update article'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, article_model_2.Article]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "putArticle", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Delete article'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "delArticle", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update articles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticlesStateDTO]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "patchArticles", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Delete articles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.ArticleIdsDTO]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "delArticles", null);
exports.ArticleController = ArticleController = __decorate([
    (0, common_1.Controller)('article'),
    __metadata("design:paramtypes", [tag_service_1.TagService,
        category_service_1.CategoryService,
        article_service_1.ArticleService])
], ArticleController);
//# sourceMappingURL=article.controller.js.map