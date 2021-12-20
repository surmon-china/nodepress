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
exports.TagProvider = exports.TagsPayload = exports.Tag = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const increment_constant_1 = require("../../constants/increment.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
const extend_model_1 = require("../../models/extend.model");
let Tag = class Tag {
};
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Tag.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '标签名称？' }),
    (0, class_validator_1.IsString)({ message: '字符串？' }),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '标签别名？' }),
    (0, class_validator_1.IsString)({ message: '字符串？' }),
    (0, class_validator_1.IsAlphanumeric)('en-US', { message: 'slug 只允许字母和数字' }),
    (0, class_validator_1.MaxLength)(30),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Tag.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '字符串？' }),
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Tag.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, typegoose_1.prop)({ _id: false, type: () => [extend_model_1.Extend] }),
    __metadata("design:type", Array)
], Tag.prototype, "extends", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, immutable: true }),
    __metadata("design:type", Date)
], Tag.prototype, "create_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Tag.prototype, "update_at", void 0);
Tag = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, increment_constant_1.generalAutoIncrementIDConfig),
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: {
                createdAt: 'create_at',
                updatedAt: 'update_at',
            },
        },
    })
], Tag);
exports.Tag = Tag;
class TagsPayload {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], TagsPayload.prototype, "tag_ids", void 0);
exports.TagsPayload = TagsPayload;
exports.TagProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Tag);
//# sourceMappingURL=tag.model.js.map