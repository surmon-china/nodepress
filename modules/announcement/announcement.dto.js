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
const guest_permission_decorator_1 = require("../../decorators/guest-permission.decorator");
const paginate_model_1 = require("../../models/paginate.model");
const query_model_1 = require("../../models/query.model");
const announcement_constant_1 = require("./announcement.constant");
class AnnouncementPaginateQueryDTO extends (0, mapped_types_1.IntersectionType)(paginate_model_1.PaginateOptionDTO, query_model_1.KeywordQueryDTO) {
    status;
}
exports.AnnouncementPaginateQueryDTO = AnnouncementPaginateQueryDTO;
__decorate([
    (0, guest_permission_decorator_1.WithGuestPermission)({
        only: [announcement_constant_1.AnnouncementStatus.Published],
        default: announcement_constant_1.AnnouncementStatus.Published
    }),
    (0, class_validator_1.IsIn)(announcement_constant_1.ANNOUNCEMENT_STATUSES),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, value_transformer_1.unknownToNumber)(value)),
    __metadata("design:type", Number)
], AnnouncementPaginateQueryDTO.prototype, "status", void 0);
class AnnouncementsDTO {
    announcement_ids;
}
exports.AnnouncementsDTO = AnnouncementsDTO;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AnnouncementsDTO.prototype, "announcement_ids", void 0);
//# sourceMappingURL=announcement.dto.js.map