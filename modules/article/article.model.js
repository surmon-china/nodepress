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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleProvider = exports.Article = exports.ArticleStats = exports.ARTICLE_WITHOUT_CONTENT_PROJECTION = exports.ARTICLE_WITH_CONTENT_PROJECTION = exports.ARTICLE_RELATION_FIELDS = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const normalize_string_decorator_1 = require("../../decorators/normalize-string.decorator");
const database_constant_1 = require("../../constants/database.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
const key_value_model_1 = require("../../models/key-value.model");
const category_model_1 = require("../category/category.model");
const tag_model_1 = require("../tag/tag.model");
const article_constant_1 = require("./article.constant");
exports.ARTICLE_RELATION_FIELDS = ['tags', 'categories'];
exports.ARTICLE_WITH_CONTENT_PROJECTION = '+content';
exports.ARTICLE_WITHOUT_CONTENT_PROJECTION = { content: 0 };
const ARTICLE_DEFAULT_STATS = Object.freeze({
    likes: 0,
    views: 0,
    comments: 0
});
class ArticleStats {
    likes;
    views;
    comments;
}
exports.ArticleStats = ArticleStats;
__decorate([
    (0, typegoose_1.prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], ArticleStats.prototype, "likes", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], ArticleStats.prototype, "views", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], ArticleStats.prototype, "comments", void 0);
let Article = class Article {
    id;
    slug;
    title;
    content;
    summary;
    keywords;
    thumbnail;
    status;
    origin;
    lang;
    featured;
    disabled_comments;
    stats;
    tags;
    categories;
    extras;
    created_at;
    updated_at;
};
exports.Article = Article;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Article.prototype, "id", void 0);
__decorate([
    (0, class_validator_2.MaxLength)(50),
    (0, class_validator_2.Matches)(/^[a-zA-Z0-9-_]+$/),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    (0, typegoose_1.prop)({ type: String, default: null, unique: true, index: true, trim: true, validate: /^[a-zA-Z0-9-_]+$/ }),
    __metadata("design:type", Object)
], Article.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, typegoose_1.prop)({ type: String, required: true, validate: /\S+/, text: true }),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, typegoose_1.prop)({ type: String, required: true, validate: /\S+/, select: false, text: true }),
    __metadata("design:type", String)
], Article.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: '', text: true }),
    __metadata("design:type", String)
], Article.prototype, "summary", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [String], default: [] }),
    __metadata("design:type", Array)
], Article.prototype, "keywords", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null, trim: true }),
    __metadata("design:type", Object)
], Article.prototype, "thumbnail", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(article_constant_1.ArticleStatus),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: Number, enum: article_constant_1.ArticleStatus, default: article_constant_1.ArticleStatus.Published, index: true }),
    __metadata("design:type", Number)
], Article.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(article_constant_1.ArticleOrigin),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: Number, enum: article_constant_1.ArticleOrigin, default: article_constant_1.ArticleOrigin.Original }),
    __metadata("design:type", Number)
], Article.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(article_constant_1.ArticleLanguage),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, enum: article_constant_1.ArticleLanguage, default: article_constant_1.ArticleLanguage.Chinese }),
    __metadata("design:type", String)
], Article.prototype, "lang", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: Boolean, default: false, index: true }),
    __metadata("design:type", Boolean)
], Article.prototype, "featured", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Article.prototype, "disabled_comments", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => ArticleStats, _id: false, default: { ...ARTICLE_DEFAULT_STATS } }),
    __metadata("design:type", ArticleStats)
], Article.prototype, "stats", void 0);
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ ref: () => tag_model_1.Tag, default: [] }),
    __metadata("design:type", Array)
], Article.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, typegoose_1.prop)({ ref: () => category_model_1.Category, required: true }),
    __metadata("design:type", Array)
], Article.prototype, "categories", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => key_value_model_1.KeyValueModel),
    (0, class_validator_2.ValidateNested)({ each: true }),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_2.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [key_value_model_1.KeyValueModel], _id: false, default: [] }),
    __metadata("design:type", Array)
], Article.prototype, "extras", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now, immutable: true, index: true }),
    __metadata("design:type", Date)
], Article.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Article.prototype, "updated_at", void 0);
exports.Article = Article = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, database_constant_1.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG),
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            id: false,
            versionKey: false,
            toObject: { getters: true },
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    }),
    (0, typegoose_1.index)({ status: 1, created_at: -1 }),
    (0, typegoose_1.index)({ tags: 1, status: 1, created_at: -1 }),
    (0, typegoose_1.index)({ categories: 1, status: 1, created_at: -1 }),
    (0, typegoose_1.index)({ title: 'text', content: 'text', summary: 'text' }, {
        name: 'SearchIndex',
        weights: {
            title: 10,
            summary: 12,
            content: 8
        }
    })
], Article);
exports.ArticleProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Article);
//# sourceMappingURL=article.model.js.map