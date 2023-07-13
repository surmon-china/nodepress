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
exports.FeedbacksDTO = exports.FeedbackPaginateQueryDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const query_model_1 = require("../../models/query.model");
const paginate_model_1 = require("../../models/paginate.model");
const value_transformer_1 = require("../../transformers/value.transformer");
const feedback_model_1 = require("./feedback.model");
class FeedbackPaginateQueryDTO extends (0, mapped_types_1.IntersectionType)(paginate_model_1.PaginateOptionDTO, query_model_1.KeywordQueryDTO) {
}
exports.FeedbackPaginateQueryDTO = FeedbackPaginateQueryDTO;
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], FeedbackPaginateQueryDTO.prototype, "tid", void 0);
__decorate([
    (0, class_validator_1.IsIn)(feedback_model_1.FEEDBACK_EMOTION_VALUES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], FeedbackPaginateQueryDTO.prototype, "emotion", void 0);
__decorate([
    (0, class_validator_1.IsIn)([0, 1]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], FeedbackPaginateQueryDTO.prototype, "marked", void 0);
class FeedbacksDTO {
}
exports.FeedbacksDTO = FeedbacksDTO;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], FeedbacksDTO.prototype, "feedback_ids", void 0);
//# sourceMappingURL=feedback.dto.js.map