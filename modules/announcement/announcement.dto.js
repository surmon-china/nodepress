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
exports.AnnouncementsDTO = exports.AnnouncementPaginateQueryDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const value_transformer_1 = require("../../transformers/value.transformer");
const guest_decorator_1 = require("../../decorators/guest.decorator");
const biz_interface_1 = require("../../interfaces/biz.interface");
const paginate_model_1 = require("../../models/paginate.model");
const query_model_1 = require("../../models/query.model");
const announcement_model_1 = require("./announcement.model");
class AnnouncementPaginateQueryDTO extends (0, mapped_types_1.IntersectionType)(paginate_model_1.PaginateOptionDTO, query_model_1.KeywordQueryDTO) {
}
__decorate([
    (0, guest_decorator_1.WhenGuest)({ only: [biz_interface_1.PublishState.Published], default: biz_interface_1.PublishState.Published }),
    (0, class_validator_1.IsIn)(announcement_model_1.ANNOUNCEMENT_STATES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknowToNumber)(value)),
    __metadata("design:type", Number)
], AnnouncementPaginateQueryDTO.prototype, "state", void 0);
exports.AnnouncementPaginateQueryDTO = AnnouncementPaginateQueryDTO;
class AnnouncementsDTO {
}
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AnnouncementsDTO.prototype, "announcement_ids", void 0);
exports.AnnouncementsDTO = AnnouncementsDTO;
//# sourceMappingURL=announcement.dto.js.map