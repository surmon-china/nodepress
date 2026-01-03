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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const cache_service_1 = require("../../core/cache/cache.service");
const archive_service_1 = require("../archive/archive.service");
const helper_service_seo_1 = require("../../core/helper/helper.service.seo");
const article_model_1 = require("../article/article.model");
const cache_constant_1 = require("../../constants/cache.constant");
const biz_constant_1 = require("../../constants/biz.constant");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const category_model_1 = require("./category.model");
const logger = (0, logger_1.createLogger)({ scope: 'CategoryService', time: app_environment_1.isDevEnv });
let CategoryService = class CategoryService {
    seoService;
    cacheService;
    archiveService;
    articleModel;
    categoryModel;
    allCategoriesCache;
    constructor(seoService, cacheService, archiveService, articleModel, categoryModel) {
        this.seoService = seoService;
        this.cacheService = cacheService;
        this.archiveService = archiveService;
        this.articleModel = articleModel;
        this.categoryModel = categoryModel;
        this.allCategoriesCache = this.cacheService.manual({
            key: cache_constant_1.CacheKeys.AllCategories,
            promise: () => this.getAllCategories({ aggregatePublicOnly: true })
        });
        this.allCategoriesCache.update().catch((error) => {
            logger.warn('Init getAllCategories failed!', error);
        });
    }
    async aggregateArticleCount(publicOnly, categories) {
        const counts = await this.articleModel.aggregate([
            { $match: publicOnly ? article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
            { $unwind: '$categories' },
            { $group: { _id: '$categories', count: { $sum: 1 } } }
        ]);
        return categories.map((category) => {
            const found = counts.find((item) => item._id.equals(category._id));
            return { ...category, article_count: found ? found.count : 0 };
        });
    }
    async getAllCategories(options) {
        const allCategories = await this.categoryModel.find().lean().sort({ _id: biz_constant_1.SortType.Desc }).exec();
        return await this.aggregateArticleCount(options.aggregatePublicOnly, allCategories);
    }
    getAllCategoriesCache() {
        return this.allCategoriesCache.get();
    }
    updateAllCategoriesCache() {
        return this.allCategoriesCache.update();
    }
    async paginate(filter, options, publicOnly) {
        const result = await this.categoryModel.paginateRaw(filter, options);
        const documents = await this.aggregateArticleCount(publicOnly, result.documents);
        return { ...result, documents };
    }
    async getDetailBySlug(slug) {
        const category = await this.categoryModel.findOne({ slug }).lean().exec();
        if (!category)
            throw new common_1.NotFoundException(`Category '${slug}' not found`);
        return category;
    }
    async create(newCategory) {
        const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).lean().exec();
        if (existedCategory) {
            throw new common_1.ConflictException(`Category slug '${newCategory.slug}' already exists`);
        }
        const category = await this.categoryModel.create(newCategory);
        this.seoService.push((0, urlmap_transformer_1.getCategoryUrl)(category.slug));
        this.archiveService.updateCache();
        this.updateAllCategoriesCache();
        return category;
    }
    getGenealogyById(categoryId) {
        const categories = [];
        const findById = this.categoryModel.findById.bind(this.categoryModel);
        return new Promise((resolve, reject) => {
            ;
            (function findCateItem(id) {
                findById(id)
                    .lean()
                    .exec()
                    .then((category) => {
                    if (!category) {
                        return id === categoryId
                            ? reject(new common_1.NotFoundException(`Category '${categoryId}' not found`))
                            : resolve(categories);
                    }
                    categories.unshift(category);
                    const parentId = category.pid;
                    const hasParent = parentId && parentId.toString() !== category._id.toString();
                    return hasParent ? findCateItem(parentId) : resolve(categories);
                })
                    .catch(reject);
            })(categoryId);
        });
    }
    async update(categoryId, newCategory) {
        const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).lean().exec();
        if (existedCategory && !existedCategory._id.equals(categoryId)) {
            throw new common_1.ConflictException(`Category slug '${newCategory.slug}' already exists`);
        }
        const category = await this.categoryModel.findByIdAndUpdate(categoryId, newCategory, { new: true }).exec();
        if (!category)
            throw new common_1.NotFoundException(`Category '${categoryId}' not found`);
        this.seoService.push((0, urlmap_transformer_1.getCategoryUrl)(category.slug));
        this.archiveService.updateCache();
        this.updateAllCategoriesCache();
        return category;
    }
    async delete(categoryId) {
        const category = await this.categoryModel.findByIdAndDelete(categoryId, null).exec();
        if (!category)
            throw new common_1.NotFoundException(`Category '${categoryId}' not found`);
        this.archiveService.updateCache();
        this.seoService.delete((0, urlmap_transformer_1.getCategoryUrl)(category.slug));
        this.updateAllCategoriesCache();
        const categories = await this.categoryModel.find({ pid: categoryId }).lean().exec();
        if (!categories.length)
            return category;
        await this.categoryModel.collection
            .initializeOrderedBulkOp()
            .find({ _id: { $in: Array.from(categories, (c) => c._id) } })
            .update({ $set: { pid: category.pid || null } })
            .execute();
        return category;
    }
    async batchDelete(categoryIds) {
        const categories = await this.categoryModel
            .find({ _id: { $in: categoryIds } })
            .lean()
            .exec();
        const actionResult = await this.categoryModel.deleteMany({ _id: { $in: categoryIds } }).exec();
        this.archiveService.updateCache();
        this.updateAllCategoriesCache();
        this.seoService.delete(categories.map((category) => (0, urlmap_transformer_1.getCategoryUrl)(category.slug)));
        return actionResult;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __param(4, (0, model_transformer_1.InjectModel)(category_model_1.Category)),
    __metadata("design:paramtypes", [helper_service_seo_1.SeoService,
        cache_service_1.CacheService,
        archive_service_1.ArchiveService, Object, Object])
], CategoryService);
//# sourceMappingURL=category.service.js.map