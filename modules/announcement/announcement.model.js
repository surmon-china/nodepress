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
exports.AnnouncementProvider = exports.AnnouncementsPayload = exports.Announcement = void 0;
const auto_increment_1 = require("@typegoose/auto-increment");
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const increment_constant_1 = require("../../constants/increment.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const paginate_1 = require("../../utils/paginate");
const biz_interface_1 = require("../../interfaces/biz.interface");
let Announcement = class Announcement {
};
__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    __metadata("design:type", Number)
], Announcement.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'content?' }),
    (0, class_validator_1.IsString)({ message: 'string?' }),
    (0, typegoose_1.prop)({ required: true, validate: /\S+/ }),
    __metadata("design:type", String)
], Announcement.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsIn)([biz_interface_1.PublishState.Draft, biz_interface_1.PublishState.Published]),
    (0, class_validator_1.IsInt)({ message: 'PublishState?' }),
    (0, typegoose_1.prop)({ enum: biz_interface_1.PublishState, default: biz_interface_1.PublishState.Published, index: true }),
    __metadata("design:type", Number)
], Announcement.prototype, "state", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, immutable: true }),
    __metadata("design:type", Date)
], Announcement.prototype, "create_at", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Announcement.prototype, "update_at", void 0);
Announcement = __decorate([
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
], Announcement);
exports.Announcement = Announcement;
class AnnouncementsPayload {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], AnnouncementsPayload.prototype, "announcement_ids", void 0);
exports.AnnouncementsPayload = AnnouncementsPayload;
exports.AnnouncementProvider = (0, model_transformer_1.getProviderByTypegooseClass)(Announcement);
//# sourceMappingURL=announcement.model.js.map