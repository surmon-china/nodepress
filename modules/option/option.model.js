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
exports.OptionProvider = exports.Option = exports.Blocklist = exports.DEFAULT_OPTION = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const model_transformer_1 = require("../../transformers/model.transformer");
exports.DEFAULT_OPTION = Object.freeze({
    title: 'NodePress',
    sub_title: 'blog server app',
    description: 'RESTful API service for blog',
    keywords: [],
    site_url: 'https://github.com/surmon-china/nodepress',
    site_email: 'admin@example.com',
    blocklist: {
        ips: [],
        mails: [],
        keywords: [],
    },
    meta: { likes: 0 },
    ad_config: '',
});
class AppMeta {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], AppMeta.prototype, "likes", void 0);
class Blocklist {
}
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [String], default: [] }),
    __metadata("design:type", Array)
], Blocklist.prototype, "ips", void 0);
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [String], default: [] }),
    __metadata("design:type", Array)
], Blocklist.prototype, "mails", void 0);
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [String], default: [] }),
    __metadata("design:type", Array)
], Blocklist.prototype, "keywords", void 0);
exports.Blocklist = Blocklist;
let Option = class Option {
};
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'title?' }),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Option.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'sub title?' }),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Option.prototype, "sub_title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Option.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: () => [String], default: [] }),
    __metadata("design:type", Array)
], Option.prototype, "keywords", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Option.prototype, "site_url", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Option.prototype, "site_email", void 0);
__decorate([
    (0, typegoose_1.prop)({ _id: false, default: Object.assign({}, exports.DEFAULT_OPTION.meta) }),
    __metadata("design:type", AppMeta)
], Option.prototype, "meta", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Blocklist),
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ _id: false, default: Object.assign({}, exports.DEFAULT_OPTION.blocklist) }),
    __metadata("design:type", Blocklist)
], Option.prototype, "blocklist", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], Option.prototype, "ad_config", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Option.prototype, "update_at", void 0);
Option = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: {
                createdAt: false,
                updatedAt: 'update_at',
            },
        },
    })
], Option);
exports.Option = Option;
exports.OptionProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Option);
//# sourceMappingURL=option.model.js.map