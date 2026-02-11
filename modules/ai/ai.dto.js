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
exports.GenerateAiCommentReplyDTO = exports.GenerateAiArticleContentDTO = exports.GenerateAiContentDTO = void 0;
const class_validator_1 = require("class-validator");
const ai_config_1 = require("./ai.config");
class GenerateAiContentDTO {
    prompt;
    model;
    temperature;
}
exports.GenerateAiContentDTO = GenerateAiContentDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateAiContentDTO.prototype, "prompt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ai_config_1.AiModelIds),
    __metadata("design:type", String)
], GenerateAiContentDTO.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GenerateAiContentDTO.prototype, "temperature", void 0);
class GenerateAiArticleContentDTO extends GenerateAiContentDTO {
    article_id;
}
exports.GenerateAiArticleContentDTO = GenerateAiArticleContentDTO;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], GenerateAiArticleContentDTO.prototype, "article_id", void 0);
class GenerateAiCommentReplyDTO extends GenerateAiContentDTO {
    comment_id;
}
exports.GenerateAiCommentReplyDTO = GenerateAiCommentReplyDTO;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], GenerateAiCommentReplyDTO.prototype, "comment_id", void 0);
//# sourceMappingURL=ai.dto.js.map