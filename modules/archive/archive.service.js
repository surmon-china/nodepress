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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const cache_service_1 = require("../../processors/cache/cache.service");
const biz_constant_1 = require("../../constants/biz.constant");
const category_model_1 = require("../category/category.model");
const article_model_1 = require("../article/article.model");
const tag_model_1 = require("../tag/tag.model");
const CACHE_KEY = __importStar(require("../../constants/cache.constant"));
const logger_1 = __importDefault(require("../../utils/logger"));
const log = logger_1.default.scope('ArchiveService');
let ArchiveService = class ArchiveService {
    constructor(cacheService, tagModel, articleModel, categoryModel) {
        this.cacheService = cacheService;
        this.tagModel = tagModel;
        this.articleModel = articleModel;
        this.categoryModel = categoryModel;
        this.archiveCache = this.cacheService.promise({
            ioMode: true,
            key: CACHE_KEY.ARCHIVE,
            promise: this.getArchiveData.bind(this),
        });
        this.updateCache().catch((error) => {
            log.warn('init getArchiveData failed!', error);
        });
    }
    getAllTags() {
        return this.tagModel.find().sort({ _id: biz_constant_1.SortType.Desc }).exec();
    }
    getAllCategories() {
        return this.categoryModel.find().sort({ _id: biz_constant_1.SortType.Desc }).exec();
    }
    getAllArticles() {
        return this.articleModel
            .find(article_model_1.ARTICLE_LIST_QUERY_GUEST_FILTER, article_model_1.ARTICLE_LIST_QUERY_PROJECTION)
            .sort({ _id: biz_constant_1.SortType.Desc })
            .exec();
    }
    async getArchiveData() {
        try {
            return {
                tags: await this.getAllTags(),
                categories: await this.getAllCategories(),
                articles: await this.getAllArticles(),
            };
        }
        catch (error) {
            log.warn('getArchiveData failed!', error);
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
ArchiveService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(tag_model_1.Tag)),
    __param(2, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __param(3, (0, model_transformer_1.InjectModel)(category_model_1.Category)),
    __metadata("design:paramtypes", [cache_service_1.CacheService, Object, Object, Object])
], ArchiveService);
exports.ArchiveService = ArchiveService;
//# sourceMappingURL=archive.service.js.map