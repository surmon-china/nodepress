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
exports.CommentProvider = exports.CommentsStatePayload = exports.CommentsPayload = exports.Comment = exports.CreateCommentBase = exports.Author = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const increment_constant_1 = require("../../constants/increment.constant");
const paginate_1 = require("../../utils/paginate");
const model_transformer_1 = require("../../transformers/model.transformer");
const biz_interface_1 = require("../../interfaces/biz.interface");
const extend_model_1 = require("../../models/extend.model");
class Author {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '作者名称？' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Author.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '作者邮箱？' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Author.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)(),
    (0, typegoose_1.prop)({
        validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
    }),
    __metadata("design:type", String)
], Author.prototype, "site", void 0);
exports.Author = Author;
class CreateCommentBase {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '文章 Id？' }),
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], CreateCommentBase.prototype, "post_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: biz_interface_1.CommentParentID.Self, index: true }),
    __metadata("design:type", Number)
], CreateCommentBase.prototype, "pid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '评论内容？' }),
    (0, class_validator_1.IsString)({ message: '字符串？' }),
    (0, class_validator_1.MaxLength)(3000),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], CreateCommentBase.prototype, "content", void 0);
__decorate([
    (0, typegoose_1.prop)({ validate: /\S+/ }),
    __metadata("design:type", String)
], CreateCommentBase.prototype, "agent", void 0);
__decorate([
    (0, typegoose_1.prop)({ _id: false }),
    __metadata("design:type", Author)
], CreateCommentBase.prototype, "author", void 0);
exports.CreateCommentBase = CreateCommentBase;
let Comment = class Comment extends CreateCommentBase {
};
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsIn)([biz_interface_1.CommentState.Auditing, biz_interface_1.CommentState.Deleted, biz_interface_1.CommentState.Published, biz_interface_1.CommentState.Spam]),
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ enum: biz_interface_1.CommentState, default: biz_interface_1.CommentState.Published, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Comment.prototype, "is_top", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], Comment.prototype, "likes", void 0);
__decorate([
    (0, class_validator_1.IsIP)(),
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Comment.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: {}, type: Object }),
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
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, typegoose_1.prop)({ _id: false, type: () => [extend_model_1.Extend] }),
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
class CommentsPayload {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], CommentsPayload.prototype, "comment_ids", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], CommentsPayload.prototype, "post_ids", void 0);
exports.CommentsPayload = CommentsPayload;
class CommentsStatePayload extends CommentsPayload {
}
__decorate([
    (0, class_validator_1.IsIn)([biz_interface_1.CommentState.Auditing, biz_interface_1.CommentState.Deleted, biz_interface_1.CommentState.Published, biz_interface_1.CommentState.Spam]),
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ enum: biz_interface_1.CommentState, default: biz_interface_1.CommentState.Published }),
    __metadata("design:type", Number)
], CommentsStatePayload.prototype, "state", void 0);
exports.CommentsStatePayload = CommentsStatePayload;
exports.CommentProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Comment);
//# sourceMappingURL=comment.model.js.map