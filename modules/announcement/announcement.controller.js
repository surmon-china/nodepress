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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const common_1 = require("@nestjs/common");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const announcement_dto_1 = require("./announcement.dto");
const announcement_dto_2 = require("./announcement.dto");
const announcement_service_1 = require("./announcement.service");
let AnnouncementController = class AnnouncementController {
    announcementService;
    constructor(announcementService) {
        this.announcementService = announcementService;
    }
    getAnnouncements(query) {
        const { sort, page, per_page, ...filters } = query;
        const queryFilter = {};
        if (filters.keyword) {
            queryFilter.content = { $regex: filters.keyword, $options: 'i' };
        }
        if (!(0, isUndefined_1.default)(filters.status)) {
            queryFilter.status = filters.status;
        }
        return this.announcementService.paginate(queryFilter, {
            page,
            perPage: per_page,
            dateSort: sort
        });
    }
    createAnnouncement(dto) {
        return this.announcementService.create(dto);
    }
    deleteAnnouncements({ announcement_ids }) {
        return this.announcementService.batchDelete(announcement_ids);
    }
    updateAnnouncement(id, dto) {
        return this.announcementService.update(id, dto);
    }
    deleteAnnouncement(id) {
        return this.announcementService.delete(id);
    }
};
exports.AnnouncementController = AnnouncementController;
__decorate([
    (0, common_1.Get)(),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get announcements succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_dto_1.AnnouncementPaginateQueryDto]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "getAnnouncements", null);
__decorate([
    (0, common_1.Post)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Create announcement succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_dto_2.CreateAnnouncementDto]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "createAnnouncement", null);
__decorate([
    (0, common_1.Delete)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete announcements succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_dto_1.AnnouncementIdsDto]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "deleteAnnouncements", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update announcement succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, announcement_dto_2.UpdateAnnouncementDto]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "updateAnnouncement", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete announcement succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "deleteAnnouncement", null);
exports.AnnouncementController = AnnouncementController = __decorate([
    (0, common_1.Controller)('announcements'),
    __metadata("design:paramtypes", [announcement_service_1.AnnouncementService])
], AnnouncementController);
//# sourceMappingURL=announcement.controller.js.map