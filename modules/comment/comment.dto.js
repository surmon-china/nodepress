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
exports.CommentsStateDTO = exports.CommentsDTO = exports.CommentPaginateQueryDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const guest_decorator_1 = require("../../decorators/guest.decorator");
const biz_interface_1 = require("../../interfaces/biz.interface");
const comment_model_1 = require("./comment.model");
const query_model_1 = require("../../models/query.model");
const paginate_model_1 = require("../../models/paginate.model");
const value_transformer_1 = require("../../transformers/value.transformer");
class CommentPaginateQueryDTO extends (0, mapped_types_1.IntersectionType)(paginate_model_1.PaginateOptionWithHotSortDTO, query_model_1.KeywordQueryDTO) {
}
__decorate([
    (0, guest_decorator_1.WhenGuest)({ only: [biz_interface_1.CommentState.Published], default: biz_interface_1.CommentState.Published }),
    (0, class_validator_1.IsIn)(comment_model_1.COMMENT_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknowToNumber)(value)),
    __metadata("design:type", Number)
], CommentPaginateQueryDTO.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknowToNumber)(value)),
    __metadata("design:type", Number)
], CommentPaginateQueryDTO.prototype, "post_id", void 0);
exports.CommentPaginateQueryDTO = CommentPaginateQueryDTO;
class CommentsDTO {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], CommentsDTO.prototype, "comment_ids", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], CommentsDTO.prototype, "post_ids", void 0);
exports.CommentsDTO = CommentsDTO;
class CommentsStateDTO extends CommentsDTO {
}
__decorate([
    (0, class_validator_1.IsIn)(comment_model_1.COMMENT_STATES),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CommentsStateDTO.prototype, "state", void 0);
exports.CommentsStateDTO = CommentsStateDTO;
//# sourceMappingURL=comment.dto.js.map