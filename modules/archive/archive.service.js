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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const cache_service_1 = require("../../core/cache/cache.service");
const cache_constant_1 = require("../../constants/cache.constant");
const biz_constant_1 = require("../../constants/biz.constant");
const category_model_1 = require("../category/category.model");
const tag_model_1 = require("../tag/tag.model");
const article_model_1 = require("../article/article.model");
const article_constant_1 = require("../article/article.constant");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const logger = (0, logger_1.createLogger)({ scope: 'ArchiveService', time: app_environment_1.isDevEnv });
let ArchiveService = class ArchiveService {
    cacheService;
    tagModel;
    articleModel;
    categoryModel;
    archiveCache;
    constructor(cacheService, tagModel, articleModel, categoryModel) {
        this.cacheService = cacheService;
        this.tagModel = tagModel;
        this.articleModel = articleModel;
        this.categoryModel = categoryModel;
        this.archiveCache = this.cacheService.manual({
            key: cache_constant_1.CacheKeys.Archive,
            promise: this.getArchiveData.bind(this)
        });
        this.updateCache().catch((error) => {
            logger.warn('Init getArchiveData failed!', error);
        });
    }
    getAllTags() {
        return this.tagModel.find().sort({ _id: biz_constant_1.SortOrder.Desc }).lean().exec();
    }
    getAllCategories() {
        return this.categoryModel.find().sort({ _id: biz_constant_1.SortOrder.Desc }).lean().exec();
    }
    getAllArticles() {
        return this.articleModel
            .find(article_constant_1.ARTICLE_LIST_QUERY_GUEST_FILTER, article_constant_1.ARTICLE_LIST_QUERY_PROJECTION)
            .sort({ _id: biz_constant_1.SortOrder.Desc })
            .lean()
            .exec();
    }
    async getArchiveData() {
        try {
            const [tags, categories, articles] = await Promise.all([
                this.getAllTags(),
                this.getAllCategories(),
                this.getAllArticles()
            ]);
            return { tags, categories, articles };
        }
        catch (error) {
            logger.warn('getArchiveData failed!', error);
            return {};
        }
    }
    getCache() {
        return this.archiveCache.get();
    }
    updateCache() {
        return this.archiveCache.update();
    }
};
exports.ArchiveService = ArchiveService;
exports.ArchiveService = ArchiveService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(tag_model_1.Tag)),
    __param(2, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __param(3, (0, model_transformer_1.InjectModel)(category_model_1.Category)),
    __metadata("design:paramtypes", [cache_service_1.CacheService, Object, Object, Object])
], ArchiveService);
//# sourceMappingURL=archive.service.js.map