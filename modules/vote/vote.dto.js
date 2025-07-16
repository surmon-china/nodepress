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
exports.PostVoteDTO = exports.CommentVoteDTO = exports.VoteAuthorDTO = exports.VotesDTO = exports.VotePaginateQueryDTO = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const paginate_model_1 = require("../../models/paginate.model");
const comment_model_1 = require("../comment/comment.model");
const value_transformer_1 = require("../../transformers/value.transformer");
const vote_model_1 = require("./vote.model");
class VotePaginateQueryDTO extends paginate_model_1.PaginateOptionDTO {
    target_type;
    target_id;
    vote_type;
    author_type;
}
exports.VotePaginateQueryDTO = VotePaginateQueryDTO;
__decorate([
    (0, class_validator_2.IsIn)(vote_model_1.VOTE_TARGETS),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], VotePaginateQueryDTO.prototype, "target_type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], VotePaginateQueryDTO.prototype, "target_id", void 0);
__decorate([
    (0, class_validator_2.IsIn)(vote_model_1.VOTE_TYPES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], VotePaginateQueryDTO.prototype, "vote_type", void 0);
__decorate([
    (0, class_validator_2.IsIn)(vote_model_1.VOTE_AUTHOR_TYPES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], VotePaginateQueryDTO.prototype, "author_type", void 0);
class VotesDTO {
    vote_ids;
}
exports.VotesDTO = VotesDTO;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_2.ArrayNotEmpty)(),
    (0, class_validator_2.ArrayUnique)(),
    __metadata("design:type", Array)
], VotesDTO.prototype, "vote_ids", void 0);
class VoteAuthorDTO {
    author;
}
exports.VoteAuthorDTO = VoteAuthorDTO;
__decorate([
    (0, class_validator_2.ValidateNested)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", comment_model_1.Author)
], VoteAuthorDTO.prototype, "author", void 0);
class CommentVoteDTO extends VoteAuthorDTO {
    comment_id;
    vote;
}
exports.CommentVoteDTO = CommentVoteDTO;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], CommentVoteDTO.prototype, "comment_id", void 0);
__decorate([
    (0, class_validator_2.IsIn)(vote_model_1.VOTE_TYPES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], CommentVoteDTO.prototype, "vote", void 0);
class PostVoteDTO extends VoteAuthorDTO {
    post_id;
    vote;
}
exports.PostVoteDTO = PostVoteDTO;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], PostVoteDTO.prototype, "post_id", void 0);
__decorate([
    (0, class_validator_2.IsIn)([vote_model_1.VoteType.Upvote]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], PostVoteDTO.prototype, "vote", void 0);
//# sourceMappingURL=vote.dto.js.map