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
exports.AnnouncementProvider = exports.Announcement = exports.ANNOUNCEMENT_STATES = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const increment_constant_1 = require("../../constants/increment.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
const biz_constant_1 = require("../../constants/biz.constant");
exports.ANNOUNCEMENT_STATES = [biz_constant_1.PublishState.Draft, biz_constant_1.PublishState.Published];
let Announcement = class Announcement {
};
exports.Announcement = Announcement;
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Announcement.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'content?' }),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Announcement.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.ANNOUNCEMENT_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    (0, typegoose_1.prop)({ enum: biz_constant_1.PublishState, default: biz_constant_1.PublishState.Published, index: true }),
    __metadata("design:type", Number)
], Announcement.prototype, "state", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, immutable: true }),
    __metadata("design:type", Date)
], Announcement.prototype, "created_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Announcement.prototype, "updated_at", void 0);
exports.Announcement = Announcement = __decorate([
    (0, typegoose_1.plugin)(paginate_1.mongoosePaginate),
    (0, typegoose_1.plugin)(auto_increment_1.AutoIncrementID, increment_constant_1.generalAutoIncrementIDConfig),
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            versionKey: false,
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    })
], Announcement);
exports.AnnouncementProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Announcement);
//# sourceMappingURL=announcement.model.js.map