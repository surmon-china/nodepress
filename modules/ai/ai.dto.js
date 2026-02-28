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
exports.GenerateAiCommentReplyDto = exports.GenerateAiArticleContentDto = exports.GenerateAiContentDto = void 0;
const class_validator_1 = require("class-validator");
const ai_config_1 = require("./ai.config");
class GenerateAiContentDto {
    prompt;
    model;
    temperature;
}
exports.GenerateAiContentDto = GenerateAiContentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateAiContentDto.prototype, "prompt", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ai_config_1.AiModelIds),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateAiContentDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GenerateAiContentDto.prototype, "temperature", void 0);
class GenerateAiArticleContentDto extends GenerateAiContentDto {
    article_id;
}
exports.GenerateAiArticleContentDto = GenerateAiArticleContentDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], GenerateAiArticleContentDto.prototype, "article_id", void 0);
class GenerateAiCommentReplyDto extends GenerateAiContentDto {
    comment_id;
}
exports.GenerateAiCommentReplyDto = GenerateAiCommentReplyDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], GenerateAiCommentReplyDto.prototype, "comment_id", void 0);
//# sourceMappingURL=ai.dto.js.map