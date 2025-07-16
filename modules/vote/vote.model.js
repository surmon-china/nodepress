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
exports.VoteProvider = exports.Vote = exports.VOTE_AUTHOR_TYPES = exports.VOTE_TARGETS = exports.VOTE_TYPES = exports.VoteAuthorType = exports.voteTypeMap = exports.VoteType = exports.VoteTarget = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const database_constant_1 = require("../../constants/database.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
var VoteTarget;
(function (VoteTarget) {
    VoteTarget[VoteTarget["Post"] = 1] = "Post";
    VoteTarget[VoteTarget["Comment"] = 2] = "Comment";
})(VoteTarget || (exports.VoteTarget = VoteTarget = {}));
var VoteType;
(function (VoteType) {
    VoteType[VoteType["Upvote"] = 1] = "Upvote";
    VoteType[VoteType["Downvote"] = -1] = "Downvote";
})(VoteType || (exports.VoteType = VoteType = {}));
exports.voteTypeMap = new Map([
    [VoteType.Upvote, '+1'],
    [VoteType.Downvote, '-1']
]);
var VoteAuthorType;
(function (VoteAuthorType) {
    VoteAuthorType[VoteAuthorType["Anonymous"] = 0] = "Anonymous";
    VoteAuthorType[VoteAuthorType["Guest"] = 1] = "Guest";
    VoteAuthorType[VoteAuthorType["Disqus"] = 2] = "Disqus";
})(VoteAuthorType || (exports.VoteAuthorType = VoteAuthorType = {}));
exports.VOTE_TYPES = [VoteType.Upvote, VoteType.Downvote];
exports.VOTE_TARGETS = [VoteTarget.Post, VoteTarget.Comment];
exports.VOTE_AUTHOR_TYPES = [VoteAuthorType.Anonymous, VoteAuthorType.Guest, VoteAuthorType.Disqus];
let Vote = class Vote {
    id;
    target_type;
    target_id;
    vote_type;
    author_type;
    author;
    ip;
    ip_location;
    user_agent;
    created_at;
    updated_at;
};
exports.Vote = Vote;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Vote.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.VOTE_TARGETS),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], Vote.prototype, "target_type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], Vote.prototype, "target_id", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.VOTE_TYPES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], Vote.prototype, "vote_type", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.VOTE_AUTHOR_TYPES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], Vote.prototype, "author_type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], Vote.prototype, "author", void 0);
__decorate([
    (0, class_validator_1.IsIP)(),
    (0, class_validator_1.IsOptional)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Vote.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], Vote.prototype, "ip_location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Vote.prototype, "user_agent", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, immutable: true }),
    __metadata("design:type", Date)
], Vote.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Vote.prototype, "updated_at", void 0);
exports.Vote = Vote = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, database_constant_1.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG),
    (0, typegoose_1.modelOptions)({
        options: { allowMixed: typegoose_1.Severity.ALLOW },
        schemaOptions: {
            versionKey: false,
            toJSON: { virtuals: true },
            toObject: { virtuals: true },
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    })
], Vote);
exports.VoteProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Vote);
//# sourceMappingURL=vote.model.js.map