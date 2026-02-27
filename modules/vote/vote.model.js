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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteProvider = exports.Vote = void 0;
const mongoose_lean_virtuals_1 = __importDefault(require("mongoose-lean-virtuals"));
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const database_constant_1 = require("../../constants/database.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
const user_model_1 = require("../user/user.model");
const author_constant_1 = require("../../constants/author.constant");
const vote_constant_1 = require("./vote.constant");
let Vote = class Vote {
    id;
    target_type;
    target_id;
    vote_type;
    author_type;
    author_name;
    author_email;
    user;
    ip;
    ip_location;
    user_agent;
    created_at;
};
exports.Vote = Vote;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Vote.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: vote_constant_1.VoteTargetType, required: true, index: true }),
    __metadata("design:type", String)
], Vote.prototype, "target_type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true, index: true }),
    __metadata("design:type", Number)
], Vote.prototype, "target_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, enum: vote_constant_1.VoteType, required: true, index: true }),
    __metadata("design:type", Number)
], Vote.prototype, "vote_type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: author_constant_1.GeneralAuthorType, required: true, index: true }),
    __metadata("design:type", String)
], Vote.prototype, "author_type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Vote.prototype, "author_name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Vote.prototype, "author_email", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.User, default: null, index: true }),
    __metadata("design:type", Object)
], Vote.prototype, "user", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Vote.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], Vote.prototype, "ip_location", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Vote.prototype, "user_agent", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now, immutable: true, index: true }),
    __metadata("design:type", Date)
], Vote.prototype, "created_at", void 0);
exports.Vote = Vote = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(mongoose_lean_virtuals_1.default),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, database_constant_1.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG),
    (0, typegoose_1.index)({ target_type: 1, target_id: 1, created_at: -1 }),
    (0, typegoose_1.index)({ target_type: 1, target_id: 1, user: 1 }),
    (0, typegoose_1.modelOptions)({
        options: { allowMixed: typegoose_1.Severity.ALLOW },
        schemaOptions: {
            id: false,
            versionKey: false,
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    })
], Vote);
exports.VoteProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Vote);
//# sourceMappingURL=vote.model.js.map