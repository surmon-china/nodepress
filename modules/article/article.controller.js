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
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const query_params_decorator_1 = require("../../decorators/query-params.decorator");
const http_decorator_1 = require("../../decorators/http.decorator");
const auth_guard_1 = require("../../guards/auth.guard");
const humanized_auth_guard_1 = require("../../guards/humanized-auth.guard");
const biz_interface_1 = require("../../interfaces/biz.interface");
const tag_service_1 = require("../tag/tag.service");
const category_service_1 = require("../category/category.service");
const article_model_1 = require("./article.model");
const article_service_1 = require("./article.service");
let ArticleController = class ArticleController {
    constructor(tagService, categoryService, articleService) {
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.articleService = articleService;
    }
    getArticles({ querys, options, origin, isAuthenticated }) {
        if (Number(origin.sort) === biz_interface_1.SortType.Hot) {
            options.sort = article_service_1.COMMON_HOT_SORT_PARAMS;
            if (!isAuthenticated && querys.cache) {
                return this.articleService.getUserHotListCache();
            }
        }
        const keyword = lodash_1.default.trim(origin.keyword);
        if (keyword) {
            const keywordRegExp = new RegExp(keyword, 'i');
            querys.$or = [{ title: keywordRegExp }, { content: keywordRegExp }, { description: keywordRegExp }];
        }
        const slugParams = [
            {
                name: 'tag',
                field: 'tag_slug',
                service: this.tagService.getDetailBySlug.bind(this.tagService),
            },
            {
                name: 'category',
                field: 'category_slug',
                service: this.categoryService.getDetailBySlug.bind(this.categoryService),
            },
        ];
        const matchedParam = slugParams.find((item) => querys[item.field]);
        const matchedField = matchedParam === null || matchedParam === void 0 ? void 0 : matchedParam.field;
        const matchedSlug = matchedField && querys[matchedField];
        return !matchedSlug
            ? this.articleService.paginater(querys, options)
            : matchedParam.service(matchedSlug).then((param) => {
                const paramField = matchedParam.name;
                const paramId = param === null || param === void 0 ? void 0 : param._id;
                if (paramId) {
                    querys = Object.assign(querys, { [paramField]: paramId });
                    Reflect.deleteProperty(querys, matchedField);
                    return this.articleService.paginater(querys, options);
                }
                else {
                    return Promise.reject(`条件 ${matchedField} > ${matchedSlug} 不存在`);
                }
            });
    }
    getArticle({ params, isAuthenticated }) {
        return isAuthenticated && (0, mongoose_1.isValidObjectId)(params.id)
            ? this.articleService.getDetailByObjectID(params.id)
            : this.articleService.getFullDetailForUser(isNaN(params.id) ? String(params.id) : Number(params.id));
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
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(humanized_auth_guard_1.HumanizedJwtAuthGuard),
    http_decorator_1.HttpProcessor.paginate(),
    http_decorator_1.HttpProcessor.handle('Get articles'),
    __param(0, (0, query_params_decorator_1.QueryParams)([
        query_params_decorator_1.QueryParamsField.Date,
        query_params_decorator_1.QueryParamsField.State,
        query_params_decorator_1.QueryParamsField.Public,
        query_params_decorator_1.QueryParamsField.Origin,
        'cache',
        'tag',
        'category',
        'tag_slug',
        'category_slug',
    ])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(humanized_auth_guard_1.HumanizedJwtAuthGuard),
    http_decorator_1.HttpProcessor.handle({
        message: 'Get article detail',
        error: common_1.HttpStatus.NOT_FOUND,
    }),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticle", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Create article'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_model_1.Article]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "createArticle", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Update article'),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, article_model_1.Article]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "putArticle", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Delete article'),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "delArticle", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Update articles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_model_1.ArticlesStatePayload]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "patchArticles", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Delete articles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_model_1.ArticlesPayload]),
    __metadata("design:returntype", void 0)
], ArticleController.prototype, "delArticles", null);
ArticleController = __decorate([
    (0, common_1.Controller)('article'),
    __metadata("design:paramtypes", [tag_service_1.TagService,
        category_service_1.CategoryService,
        article_service_1.ArticleService])
], ArticleController);
exports.ArticleController = ArticleController;
//# sourceMappingURL=article.controller.js.map