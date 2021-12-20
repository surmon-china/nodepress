"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.StatisticService = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const mongoose_interface_1 = require("../../interfaces/mongoose.interface");
const cache_service_1 = require("../../processors/cache/cache.service");
const article_model_1 = require("../article/article.model");
const comment_model_1 = require("../comment/comment.model");
const tag_model_1 = require("../tag/tag.model");
const CACHE_KEY = __importStar(require("../../constants/cache.constant"));
const logger_1 = __importDefault(require("../../utils/logger"));
let StatisticService = class StatisticService {
    constructor(cacheService, tagModel, articleModel, commentModel) {
        this.cacheService = cacheService;
        this.tagModel = tagModel;
        this.articleModel = articleModel;
        this.commentModel = commentModel;
        this.resultData = {
            tags: null,
            views: null,
            articles: null,
            comments: null,
        };
        node_schedule_1.default.scheduleJob('1 0 0 * * *', () => {
            this.cacheService.set(CACHE_KEY.TODAY_VIEWS, 0).catch((error) => {
                logger_1.default.warn('[expansion]', 'statistic set TODAY_VIEWS Error:', error);
            });
        });
    }
    async getViewsCount() {
        const views = await this.cacheService.get(CACHE_KEY.TODAY_VIEWS);
        this.resultData.views = views || 0;
        return views;
    }
    async getTagsCount() {
        const count = await this.tagModel.countDocuments().exec();
        this.resultData.tags = count;
        return count;
    }
    async getArticlesCount() {
        const count = await this.articleModel.countDocuments().exec();
        this.resultData.articles = count;
        return count;
    }
    async getCommentsCount() {
        const count = await this.commentModel.countDocuments().exec();
        this.resultData.comments = count;
        return count;
    }
    getStatistic() {
        return Promise.all([this.getTagsCount(), this.getViewsCount(), this.getArticlesCount(), this.getCommentsCount()])
            .then(() => Promise.resolve(this.resultData))
            .catch(() => Promise.resolve(this.resultData));
    }
};
StatisticService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(tag_model_1.Tag)),
    __param(2, (0, model_transformer_1.InjectModel)(article_model_1.Article)),
    __param(3, (0, model_transformer_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [cache_service_1.CacheService, Object, Object, Object])
], StatisticService);
exports.StatisticService = StatisticService;
//# sourceMappingURL=expansion.service.statistic.js.map