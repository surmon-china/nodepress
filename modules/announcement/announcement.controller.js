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
const trim_1 = __importDefault(require("lodash/trim"));
const common_1 = require("@nestjs/common");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_optional_guard_1 = require("../../guards/admin-optional.guard");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const announcement_dto_1 = require("./announcement.dto");
const announcement_service_1 = require("./announcement.service");
const announcement_model_1 = require("./announcement.model");
let AnnouncementController = class AnnouncementController {
    announcementService;
    constructor(announcementService) {
        this.announcementService = announcementService;
    }
    getAnnouncements(query) {
        const { sort, page, per_page, ...filters } = query;
        const { keyword, state } = filters;
        const queryFilter = {};
        if (keyword) {
            queryFilter.content = new RegExp((0, trim_1.default)(keyword), 'i');
        }
        if (state != null) {
            queryFilter.state = state;
        }
        return this.announcementService.paginate(queryFilter, {
            page,
            perPage: per_page,
            dateSort: sort
        });
    }
    createAnnouncement(announcement) {
        return this.announcementService.create(announcement);
    }
    delAnnouncements(body) {
        return this.announcementService.batchDelete(body.announcement_ids);
    }
    putAnnouncement({ params }, announcement) {
        return this.announcementService.update(params.id, announcement);
    }
    delAnnouncement({ params }) {
        return this.announcementService.delete(params.id);
    }
};
exports.AnnouncementController = AnnouncementController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get announcements succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_dto_1.AnnouncementPaginateQueryDTO]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "getAnnouncements", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Create announcement succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_model_1.Announcement]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "createAnnouncement", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete announcements succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_dto_1.AnnouncementsDTO]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "delAnnouncements", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update announcement succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, announcement_model_1.Announcement]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "putAnnouncement", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete announcement succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "delAnnouncement", null);
exports.AnnouncementController = AnnouncementController = __decorate([
    (0, common_1.Controller)('announcement'),
    __metadata("design:paramtypes", [announcement_service_1.AnnouncementService])
], AnnouncementController);
//# sourceMappingURL=announcement.controller.js.map