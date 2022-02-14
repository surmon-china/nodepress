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
exports.PageVoteDTO = exports.CommentVoteDTO = exports.VoteAuthorDTO = void 0;
const class_validator_1 = require("class-validator");
const comment_model_1 = require("../comment/comment.model");
class VoteAuthorDTO {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", comment_model_1.Author)
], VoteAuthorDTO.prototype, "author", void 0);
exports.VoteAuthorDTO = VoteAuthorDTO;
class CommentVoteDTO extends VoteAuthorDTO {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], CommentVoteDTO.prototype, "comment_id", void 0);
__decorate([
    (0, class_validator_1.IsIn)([1, -1]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], CommentVoteDTO.prototype, "vote", void 0);
exports.CommentVoteDTO = CommentVoteDTO;
class PageVoteDTO extends VoteAuthorDTO {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], PageVoteDTO.prototype, "article_id", void 0);
__decorate([
    (0, class_validator_1.IsIn)([1]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], PageVoteDTO.prototype, "vote", void 0);
exports.PageVoteDTO = PageVoteDTO;
//# sourceMappingURL=vote.dto.js.map