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
exports.VoteIdsDto = exports.VotePaginateQueryDto = exports.ArticleVoteDto = exports.CommentVoteDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const paginate_dto_1 = require("../../dtos/paginate.dto");
const author_dto_1 = require("../../dtos/author.dto");
const value_transformer_1 = require("../../transformers/value.transformer");
const author_constant_1 = require("../../constants/author.constant");
const vote_constant_1 = require("./vote.constant");
class CommentVoteDto extends author_dto_1.OptionalAuthorDto {
    comment_id;
    vote;
}
exports.CommentVoteDto = CommentVoteDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], CommentVoteDto.prototype, "comment_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(vote_constant_1.VoteType),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], CommentVoteDto.prototype, "vote", void 0);
class ArticleVoteDto extends author_dto_1.OptionalAuthorDto {
    article_id;
    vote;
}
exports.ArticleVoteDto = ArticleVoteDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], ArticleVoteDto.prototype, "article_id", void 0);
__decorate([
    (0, class_validator_1.IsIn)([vote_constant_1.VoteType.Upvote]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], ArticleVoteDto.prototype, "vote", void 0);
class VotePaginateQueryDto extends paginate_dto_1.PaginateOptionDto {
    target_type;
    target_id;
    vote_type;
    author_type;
}
exports.VotePaginateQueryDto = VotePaginateQueryDto;
__decorate([
    (0, class_validator_1.IsEnum)(vote_constant_1.VoteTargetType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VotePaginateQueryDto.prototype, "target_type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], VotePaginateQueryDto.prototype, "target_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(vote_constant_1.VoteType),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], VotePaginateQueryDto.prototype, "vote_type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(author_constant_1.GeneralAuthorType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VotePaginateQueryDto.prototype, "author_type", void 0);
class VoteIdsDto {
    vote_ids;
}
exports.VoteIdsDto = VoteIdsDto;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], VoteIdsDto.prototype, "vote_ids", void 0);
//# sourceMappingURL=vote.dto.js.map