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
exports.BooleanQueryDTO = exports.KeywordQueryDTO = exports.DateQueryDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const value_transformer_1 = require("../transformers/value.transformer");
class DateQueryDTO {
    date;
}
exports.DateQueryDTO = DateQueryDTO;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DateQueryDTO.prototype, "date", void 0);
class KeywordQueryDTO {
    keyword;
}
exports.KeywordQueryDTO = KeywordQueryDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], KeywordQueryDTO.prototype, "keyword", void 0);
class BooleanQueryDTO {
    boolean;
}
exports.BooleanQueryDTO = BooleanQueryDTO;
__decorate([
    (0, class_validator_1.IsIn)([1, 0]),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], BooleanQueryDTO.prototype, "boolean", void 0);
//# sourceMappingURL=query.model.js.map