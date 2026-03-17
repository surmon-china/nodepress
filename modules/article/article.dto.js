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
exports.AllArticlesQueryDto = exports.ArticleIdsStatusDto = exports.ArticleIdsDto = exports.ArticleCalendarQueryDto = exports.ArticleContextQueryDto = exports.ArticlePaginateQueryDto = exports.UpdateArticleDto = exports.CreateArticleDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const guest_permission_decorator_1 = require("../../decorators/guest-permission.decorator");
const value_transformer_1 = require("../../transformers/value.transformer");
const queries_dto_1 = require("../../dtos/queries.dto");
const paginate_dto_1 = require("../../dtos/paginate.dto");
const article_constant_1 = require("./article.constant");
const article_model_1 = require("./article.model");
class CreateArticleDto extends (0, mapped_types_1.PickType)(article_model_1.Article, [
    'slug',
    'title',
    'content',
    'summary',
    'keywords',
    'thumbnail',
    'status',
    'origin',
    'lang',
    'featured',
    'unlisted',
    'disabled_comments',
    'tags',
    'categories',
    'extras'
]) {
}
exports.CreateArticleDto = CreateArticleDto;
class UpdateArticleDto extends (0, mapped_types_1.PartialType)(CreateArticleDto) {
}
exports.UpdateArticleDto = UpdateArticleDto;
class ArticlePaginateQueryDto extends (0, mapped_types_1.IntersectionType)(paginate_dto_1.PaginateOptionWithHotSortDto, queries_dto_1.KeywordQueryDto, queries_dto_1.DateQueryDto) {
    status;
    unlisted;
    origin;
    lang;
    featured;
    tag_slug;
    category_slug;
}
exports.ArticlePaginateQueryDto = ArticlePaginateQueryDto;
__decorate([
    (0, guest_permission_decorator_1.WithGuestPermission)({ only: [article_constant_1.ArticleStatus.Published], default: article_constant_1.ArticleStatus.Published }),
    (0, class_validator_1.IsEnum)(article_constant_1.ArticleStatus),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], ArticlePaginateQueryDto.prototype, "status", void 0);
__decorate([
    (0, guest_permission_decorator_1.WithGuestPermission)({ only: [false], default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToBoolean)(value)),
    __metadata("design:type", Boolean)
], ArticlePaginateQueryDto.prototype, "unlisted", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(article_constant_1.ArticleOrigin),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], ArticlePaginateQueryDto.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(article_constant_1.ArticleLanguage),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], ArticlePaginateQueryDto.prototype, "lang", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToBoolean)(value)),
    __metadata("design:type", Boolean)
], ArticlePaginateQueryDto.prototype, "featured", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], ArticlePaginateQueryDto.prototype, "tag_slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], ArticlePaginateQueryDto.prototype, "category_slug", void 0);
class ArticleContextQueryDto {
    related_count;
}
exports.ArticleContextQueryDto = ArticleContextQueryDto;
__decorate([
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(20),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], ArticleContextQueryDto.prototype, "related_count", void 0);
class ArticleCalendarQueryDto {
    timezone;
}
exports.ArticleCalendarQueryDto = ArticleCalendarQueryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], ArticleCalendarQueryDto.prototype, "timezone", void 0);
class ArticleIdsDto {
    article_ids;
}
exports.ArticleIdsDto = ArticleIdsDto;
__decorate([
    (0, class_validator_2.ArrayNotEmpty)(),
    (0, class_validator_2.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], ArticleIdsDto.prototype, "article_ids", void 0);
class ArticleIdsStatusDto extends ArticleIdsDto {
    status;
}
exports.ArticleIdsStatusDto = ArticleIdsStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(article_constant_1.ArticleStatus),
    (0, class_validator_2.IsDefined)(),
    __metadata("design:type", Number)
], ArticleIdsStatusDto.prototype, "status", void 0);
class AllArticlesQueryDto {
    with_detail;
}
exports.AllArticlesQueryDto = AllArticlesQueryDto;
__decorate([
    (0, guest_permission_decorator_1.WithGuestPermission)({ only: [false], default: false }),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToBoolean)(value)),
    __metadata("design:type", Boolean)
], AllArticlesQueryDto.prototype, "with_detail", void 0);
//# sourceMappingURL=article.dto.js.map