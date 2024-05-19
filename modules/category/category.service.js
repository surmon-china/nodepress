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
const cache_service_1 = require("../../processors/cache/cache.service");
const archive_service_1 = require("../archive/archive.service");
const helper_service_seo_1 = require("../../processors/helper/helper.service.seo");
const article_model_1 = require("../article/article.model");
const cache_constant_1 = require("../../constants/cache.constant");
const biz_constant_1 = require("../../constants/biz.constant");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const category_model_1 = require("./category.model");
const logger = (0, logger_1.createLogger)({ scope: 'CategoryService', time: app_environment_1.isDevEnv });
let CategoryService = class CategoryService {
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
            logger.warn('init getAllCategories failed!', error);
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
            return Object.assign(Object.assign({}, category), { article_count: found ? found.count : 0 });
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
    async paginator(query, options, publicOnly) {
        const categories = await this.categoryModel.paginate(query, Object.assign(Object.assign({}, options), { lean: true }));
        const documents = await this.aggregateArticleCount(publicOnly, categories.documents);
        return Object.assign(Object.assign({}, categories), { documents });
    }
    getDetailBySlug(slug) {
        return this.categoryModel
            .findOne({ slug })
            .exec()
            .then((result) => result || Promise.reject(`Category '${slug}' not found`));
    }
    async create(newCategory) {
        const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec();
        if (existedCategory) {
            throw `Category slug '${newCategory.slug}' is existed`;
        }
        const category = await this.categoryModel.create(newCategory);
        this.seoService.push((0, urlmap_transformer_1.getCategoryUrl)(category.slug));
        this.archiveService.updateCache();
        this.updateAllCategoriesCache();
        return category;
    }
    getGenealogyById(categoryID) {
        const categories = [];
        const findById = (id) => this.categoryModel.findById(id).exec();
        return new Promise((resolve, reject) => {
            ;
            (function findCateItem(id) {
                findById(id)
                    .then((category) => {
                    if (!category) {
                        if (id === categoryID) {
                            return reject(`Category '${categoryID}' not found`);
                        }
                        else {
                            return resolve(categories);
                        }
                    }
                    categories.unshift(category.toObject());
                    const parentId = category.pid;
                    const hasParent = parentId && parentId.toString() !== category._id.toString();
                    return hasParent ? findCateItem(parentId) : resolve(categories);
                })
                    .catch(reject);
            })(categoryID);
        });
    }
    async update(categoryID, newCategory) {
        const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec();
        if (existedCategory && !existedCategory._id.equals(categoryID)) {
            throw `Category slug '${newCategory.slug}' is existed`;
        }
        const category = await this.categoryModel.findByIdAndUpdate(categoryID, newCategory, { new: true }).exec();
        if (!category) {
            throw `Category '${categoryID}' not found`;
        }
        this.seoService.push((0, urlmap_transformer_1.getCategoryUrl)(category.slug));
        this.archiveService.updateCache();
        this.updateAllCategoriesCache();
        return category;
    }
    async delete(categoryID) {
        const category = await this.categoryModel.findByIdAndDelete(categoryID, null).exec();
        if (!category) {
            throw `Category '${categoryID}' not found`;
        }
        this.archiveService.updateCache();
        this.seoService.delete((0, urlmap_transformer_1.getCategoryUrl)(category.slug));
        this.updateAllCategoriesCache();
        const categories = await this.categoryModel.find({ pid: categoryID }).exec();
        if (!categories.length) {
            return category;
        }
        await this.categoryModel.collection
            .initializeOrderedBulkOp()
            .find({ _id: { $in: Array.from(categories, (c) => c._id) } })
            .update({ $set: { pid: category.pid || null } })
            .execute();
        return category;
    }
    async batchDelete(categoryIDs) {
        const categories = await this.categoryModel.find({ _id: { $in: categoryIDs } }).exec();
        this.seoService.delete(categories.map((category) => (0, urlmap_transformer_1.getCategoryUrl)(category.slug)));
        const actionResult = await this.categoryModel.deleteMany({ _id: { $in: categoryIDs } }).exec();
        this.archiveService.updateCache();
        this.updateAllCategoriesCache();
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