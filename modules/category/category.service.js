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
const mongoose_interface_1 = require("../../interfaces/mongoose.interface");
const paginate_1 = require("../../utils/paginate");
const biz_interface_1 = require("../../interfaces/biz.interface");
const archive_service_1 = require("../archive/archive.service");
const helper_service_seo_1 = require("../../processors/helper/helper.service.seo");
const article_model_1 = require("../article/article.model");
const category_model_1 = require("./category.model");
let CategoryService = class CategoryService {
    constructor(archiveService, seoService, articleModel, categoryModel) {
        this.archiveService = archiveService;
        this.seoService = seoService;
        this.articleModel = articleModel;
        this.categoryModel = categoryModel;
    }
    async getList(querys, options, isAuthenticated) {
        const matchState = {
            state: biz_interface_1.PublishState.Published,
            public: biz_interface_1.PublicState.Public,
        };
        const categories = await this.categoryModel.paginate(querys, options);
        const counts = await this.articleModel.aggregate([
            { $match: isAuthenticated ? {} : matchState },
            { $unwind: '$category' },
            { $group: { _id: '$category', num_tutorial: { $sum: 1 } } },
        ]);
        const categoriesObject = JSON.parse(JSON.stringify(categories));
        const newDocs = categoriesObject.docs.map((category) => {
            const finded = counts.find((count) => String(count._id) === String(category._id));
            return Object.assign(Object.assign({}, category), { count: finded ? finded.num_tutorial : 0 });
        });
        return Object.assign(Object.assign({}, categoriesObject), { docs: newDocs });
    }
    async create(newCategory) {
        const categories = await this.categoryModel.find({ slug: newCategory.slug }).exec();
        if (categories.length) {
            throw '别名已被占用';
        }
        const category = await this.categoryModel.create(newCategory);
        this.seoService.push((0, urlmap_transformer_1.getCategoryUrl)(category.slug));
        this.archiveService.updateCache();
        return category;
    }
    getGenealogyById(categoryID) {
        const categories = [];
        const findById = this.categoryModel.findById.bind(this.categoryModel);
        return new Promise((resolve, reject) => {
            ;
            (function findCateItem(id) {
                findById(id)
                    .then((category) => {
                    if (!category) {
                        return resolve(categories);
                    }
                    categories.unshift(category);
                    const parentId = category.pid;
                    const hasParent = parentId && parentId !== category.id;
                    return hasParent ? findCateItem(parentId) : resolve(categories);
                })
                    .catch(reject);
            })(categoryID);
        });
    }
    getDetailBySlug(slug) {
        return this.categoryModel.findOne({ slug }).exec();
    }
    async update(categoryID, newCategory) {
        const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec();
        if (existedCategory && String(existedCategory._id) !== String(categoryID)) {
            throw '别名已被占用';
        }
        const category = await this.categoryModel.findByIdAndUpdate(categoryID, newCategory, {
            new: true,
        });
        this.seoService.push((0, urlmap_transformer_1.getCategoryUrl)(category.slug));
        this.archiveService.updateCache();
        return category;
    }
    async delete(categoryID) {
        const category = await this.categoryModel.findByIdAndRemove(categoryID).exec();
        this.archiveService.updateCache();
        this.seoService.delete((0, urlmap_transformer_1.getCategoryUrl)(category.slug));
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
        return actionResult;
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __param(3, (0, model_transformer_1.InjectModel)(category_model_1.Category)),
    __metadata("design:paramtypes", [archive_service_1.ArchiveService,
        helper_service_seo_1.SeoService, Object, Object])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map