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
exports.FeedbackProvider = exports.Feedback = void 0;
const mongoose_lean_virtuals_1 = __importDefault(require("mongoose-lean-virtuals"));
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const database_constant_1 = require("../../constants/database.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
const user_model_1 = require("../user/user.model");
const author_constant_1 = require("../../constants/author.constant");
const feedback_constant_1 = require("./feedback.constant");
let Feedback = class Feedback {
    id;
    emotion;
    get emotion_text() {
        return feedback_constant_1.emotionsMap.get(this.emotion)?.text;
    }
    get emotion_emoji() {
        return feedback_constant_1.emotionsMap.get(this.emotion)?.emoji;
    }
    content;
    author_type;
    author_name;
    author_email;
    user;
    marked;
    remark;
    origin;
    ip;
    ip_location;
    user_agent;
    created_at;
    updated_at;
};
exports.Feedback = Feedback;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Feedback.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, enum: feedback_constant_1.FeedbackEmotion, required: true, index: true }),
    __metadata("design:type", Number)
], Feedback.prototype, "emotion", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, trim: true, validate: /\S+/, maxlength: 3000 }),
    __metadata("design:type", String)
], Feedback.prototype, "content", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: author_constant_1.GeneralAuthorType, required: true, index: true }),
    __metadata("design:type", String)
], Feedback.prototype, "author_type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Feedback.prototype, "author_name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Feedback.prototype, "author_email", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.User, default: null, index: true }),
    __metadata("design:type", Object)
], Feedback.prototype, "user", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Feedback.prototype, "marked", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null, maxlength: 1000 }),
    __metadata("design:type", Object)
], Feedback.prototype, "remark", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Feedback.prototype, "origin", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Feedback.prototype, "ip", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], Feedback.prototype, "ip_location", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Feedback.prototype, "user_agent", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now, immutable: true, index: true }),
    __metadata("design:type", Date)
], Feedback.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Feedback.prototype, "updated_at", void 0);
exports.Feedback = Feedback = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(mongoose_lean_virtuals_1.default),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, database_constant_1.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG),
    (0, typegoose_1.index)({ marked: 1, created_at: -1 }),
    (0, typegoose_1.modelOptions)({
        options: { allowMixed: typegoose_1.Severity.ALLOW },
        schemaOptions: {
            id: false,
            versionKey: false,
            toJSON: { virtuals: true },
            toObject: { virtuals: true },
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    })
], Feedback);
exports.FeedbackProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Feedback);
//# sourceMappingURL=feedback.model.js.map