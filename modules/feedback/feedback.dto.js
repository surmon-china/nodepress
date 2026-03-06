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
exports.FeedbackIdsDto = exports.FeedbackPaginateQueryDto = exports.UpdateFeedbackDto = exports.CreateFeedbackDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const normalize_string_decorator_1 = require("../../decorators/normalize-string.decorator");
const value_transformer_1 = require("../../transformers/value.transformer");
const queries_dto_1 = require("../../dtos/queries.dto");
const author_dto_1 = require("../../dtos/author.dto");
const paginate_dto_1 = require("../../dtos/paginate.dto");
const author_constant_1 = require("../../constants/author.constant");
const feedback_constant_1 = require("./feedback.constant");
class CreateFeedbackDto extends author_dto_1.OptionalAuthorDto {
    emotion;
    content;
}
exports.CreateFeedbackDto = CreateFeedbackDto;
__decorate([
    (0, class_validator_1.IsEnum)(feedback_constant_1.FeedbackEmotion),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "emotion", void 0);
__decorate([
    (0, class_validator_2.MinLength)(3),
    (0, class_validator_2.MaxLength)(3000),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "content", void 0);
class UpdateFeedbackDto extends (0, mapped_types_1.PartialType)(CreateFeedbackDto) {
    marked;
    remark;
}
exports.UpdateFeedbackDto = UpdateFeedbackDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateFeedbackDto.prototype, "marked", void 0);
__decorate([
    (0, class_validator_2.MaxLength)(1000),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    (0, normalize_string_decorator_1.NormalizeString)({ trim: true }),
    __metadata("design:type", String)
], UpdateFeedbackDto.prototype, "remark", void 0);
class FeedbackPaginateQueryDto extends (0, mapped_types_1.IntersectionType)(paginate_dto_1.PaginateOptionDto, queries_dto_1.KeywordQueryDto) {
    emotion;
    marked;
    author_type;
}
exports.FeedbackPaginateQueryDto = FeedbackPaginateQueryDto;
__decorate([
    (0, class_validator_1.IsEnum)(feedback_constant_1.FeedbackEmotion),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], FeedbackPaginateQueryDto.prototype, "emotion", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToBoolean)(value)),
    __metadata("design:type", Boolean)
], FeedbackPaginateQueryDto.prototype, "marked", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(author_constant_1.GeneralAuthorType),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], FeedbackPaginateQueryDto.prototype, "author_type", void 0);
class FeedbackIdsDto {
    feedback_ids;
}
exports.FeedbackIdsDto = FeedbackIdsDto;
__decorate([
    (0, class_validator_2.ArrayNotEmpty)(),
    (0, class_validator_2.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], FeedbackIdsDto.prototype, "feedback_ids", void 0);
//# sourceMappingURL=feedback.dto.js.map