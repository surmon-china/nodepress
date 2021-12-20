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
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../guards/auth.guard");
const humanized_auth_guard_1 = require("../../guards/humanized-auth.guard");
const query_params_decorator_1 = require("../../decorators/query-params.decorator");
const http_decorator_1 = require("../../decorators/http.decorator");
const paginate_1 = require("../../utils/paginate");
const announcement_model_1 = require("./announcement.model");
const announcement_service_1 = require("./announcement.service");
let AnnouncementController = class AnnouncementController {
    constructor(announcementService) {
        this.announcementService = announcementService;
    }
    getAnnouncements({ querys, options, origin }) {
        const keyword = lodash_1.default.trim(origin.keyword);
        if (keyword) {
            querys.content = new RegExp(keyword, 'i');
        }
        return this.announcementService.getList(querys, options);
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
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(humanized_auth_guard_1.HumanizedJwtAuthGuard),
    http_decorator_1.HttpProcessor.paginate(),
    http_decorator_1.HttpProcessor.handle('获取公告'),
    __param(0, (0, query_params_decorator_1.QueryParams)([query_params_decorator_1.QueryParamsField.State])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "getAnnouncements", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('添加公告'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_model_1.Announcement]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "createAnnouncement", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('批量删除公告'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_model_1.AnnouncementsPayload]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "delAnnouncements", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('修改公告'),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, announcement_model_1.Announcement]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "putAnnouncement", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('删除单个公告'),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "delAnnouncement", null);
AnnouncementController = __decorate([
    (0, common_1.Controller)('announcement'),
    __metadata("design:paramtypes", [announcement_service_1.AnnouncementService])
], AnnouncementController);
exports.AnnouncementController = AnnouncementController;
//# sourceMappingURL=announcement.controller.js.map