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
exports.ClaimCommentsDto = exports.CommentIdsStatusDto = exports.CommentIdsDto = exports.CommentCalendarQueryDto = exports.CommentPaginateQueryDto = exports.UpdateCommentDto = exports.CreateCommentDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const guest_permission_decorator_1 = require("../../decorators/guest-permission.decorator");
const querys_dto_1 = require("../../dtos/querys.dto");
const paginate_dto_1 = require("../../dtos/paginate.dto");
const value_transformer_1 = require("../../transformers/value.transformer");
const comment_constant_1 = require("./comment.constant");
const comment_model_1 = require("./comment.model");
class CreateCommentDto extends (0, mapped_types_1.PickType)(comment_model_1.Comment, [
    'target_type',
    'target_id',
    'parent_id',
    'content',
    'author_name',
    'author_email',
    'author_website'
]) {
}
exports.CreateCommentDto = CreateCommentDto;
class UpdateCommentDto extends (0, mapped_types_1.IntersectionType)((0, mapped_types_1.PartialType)(CreateCommentDto), (0, mapped_types_1.PartialType)((0, mapped_types_1.PickType)(comment_model_1.Comment, ['status', 'likes', 'dislikes', 'ip', 'user_agent', 'extras']))) {
}
exports.UpdateCommentDto = UpdateCommentDto;
class CommentPaginateQueryDto extends (0, mapped_types_1.IntersectionType)(paginate_dto_1.PaginateOptionWithHotSortDto, querys_dto_1.KeywordQueryDto) {
    status;
    target_type;
    target_id;
    author_type;
}
exports.CommentPaginateQueryDto = CommentPaginateQueryDto;
__decorate([
    (0, guest_permission_decorator_1.WithGuestPermission)({ only: [comment_constant_1.CommentStatus.Approved], default: comment_constant_1.CommentStatus.Approved }),
    (0, class_validator_2.IsEnum)(comment_constant_1.CommentStatus),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], CommentPaginateQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_2.IsEnum)(comment_constant_1.CommentTargetType),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], CommentPaginateQueryDto.prototype, "target_type", void 0);
__decorate([
    (0, class_validator_2.Min)(0),
    (0, class_validator_2.IsInt)(),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], CommentPaginateQueryDto.prototype, "target_id", void 0);
__decorate([
    (0, class_validator_2.IsEnum)(comment_constant_1.CommentAuthorType),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], CommentPaginateQueryDto.prototype, "author_type", void 0);
class CommentCalendarQueryDto {
    timezone;
}
exports.CommentCalendarQueryDto = CommentCalendarQueryDto;
__decorate([
    (0, class_validator_2.IsString)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], CommentCalendarQueryDto.prototype, "timezone", void 0);
class CommentIdsDto {
    comment_ids;
}
exports.CommentIdsDto = CommentIdsDto;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_2.IsArray)(),
    (0, class_validator_2.IsInt)({ each: true }),
    __metadata("design:type", Array)
], CommentIdsDto.prototype, "comment_ids", void 0);
class CommentIdsStatusDto extends CommentIdsDto {
    status;
}
exports.CommentIdsStatusDto = CommentIdsStatusDto;
__decorate([
    (0, class_validator_2.IsEnum)(comment_constant_1.CommentStatus),
    (0, class_validator_2.IsDefined)(),
    __metadata("design:type", Number)
], CommentIdsStatusDto.prototype, "status", void 0);
class ClaimCommentsDto extends CommentIdsDto {
    user_id;
}
exports.ClaimCommentsDto = ClaimCommentsDto;
__decorate([
    (0, class_validator_2.IsInt)(),
    (0, class_validator_2.IsDefined)(),
    __metadata("design:type", Number)
], ClaimCommentsDto.prototype, "user_id", void 0);
//# sourceMappingURL=comment.dto.js.map