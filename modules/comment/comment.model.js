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
exports.CommentProvider = exports.Comment = exports.CommentBase = exports.Author = exports.COMMENT_GUEST_QUERY_FILTER = exports.COMMENT_STATES = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const increment_constant_1 = require("../../constants/increment.constant");
const paginate_1 = require("../../utils/paginate");
const model_transformer_1 = require("../../transformers/model.transformer");
const codec_transformer_1 = require("../../transformers/codec.transformer");
const biz_constant_1 = require("../../constants/biz.constant");
const key_value_model_1 = require("../../models/key-value.model");
exports.COMMENT_STATES = [
    biz_constant_1.CommentState.Auditing,
    biz_constant_1.CommentState.Published,
    biz_constant_1.CommentState.Deleted,
    biz_constant_1.CommentState.Spam,
];
exports.COMMENT_GUEST_QUERY_FILTER = Object.freeze({
    state: biz_constant_1.CommentState.Published,
});
let Author = class Author {
    get email_hash() {
        var _a;
        const email = (_a = this.email) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
        return email ? (0, codec_transformer_1.decodeMD5)(email) : null;
    }
};
__decorate([
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Author.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Author.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Author.prototype, "site", void 0);
Author = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: { virtuals: true },
            toObject: { virtuals: true },
        },
    })
], Author);
exports.Author = Author;
class CommentBase {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'post ID?' }),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], CommentBase.prototype, "post_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: biz_constant_1.ROOT_COMMENT_PID, index: true }),
    __metadata("design:type", Number)
], CommentBase.prototype, "pid", void 0);
__decorate([
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(3000),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'comment content?' }),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], CommentBase.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], CommentBase.prototype, "agent", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Author),
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDefined)({ message: 'comment author?' }),
    (0, typegoose_1.prop)({ required: true, _id: false }),
    __metadata("design:type", Author)
], CommentBase.prototype, "author", void 0);
exports.CommentBase = CommentBase;
let Comment = class Comment extends CommentBase {
};
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.COMMENT_STATES),
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ enum: biz_constant_1.CommentState, default: biz_constant_1.CommentState.Published, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "likes", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "dislikes", void 0);
__decorate([
    (0, class_validator_1.IsIP)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Comment.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], Comment.prototype, "ip_location", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, immutable: true }),
    __metadata("design:type", Date)
], Comment.prototype, "create_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Comment.prototype, "update_at", void 0);
__decorate([
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    (0, typegoose_1.prop)({ _id: false, default: [], type: () => [key_value_model_1.KeyValueModel] }),
    __metadata("design:type", Array)
], Comment.prototype, "extends", void 0);
Comment = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, increment_constant_1.generalAutoIncrementIDConfig),
    (0, typegoose_1.modelOptions)({
        options: { allowMixed: typegoose_1.Severity.ALLOW },
        schemaOptions: {
            timestamps: {
                createdAt: 'create_at',
                updatedAt: 'update_at',
            },
        },
    })
], Comment);
exports.Comment = Comment;
exports.CommentProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Comment);
//# sourceMappingURL=comment.model.js.map