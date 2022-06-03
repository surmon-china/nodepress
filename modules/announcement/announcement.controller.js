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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_maybe_guard_1 = require("../../guards/admin-maybe.guard");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const expose_pipe_1 = require("../../pipes/expose.pipe");
const responser_decorator_1 = require("../../decorators/responser.decorator");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const announcement_dto_1 = require("./announcement.dto");
const announcement_service_1 = require("./announcement.service");
const announcement_model_1 = require("./announcement.model");
let AnnouncementController = class AnnouncementController {
    constructor(announcementService) {
        this.announcementService = announcementService;
    }
    getAnnouncements(query) {
        const { sort, page, per_page } = query, filters = __rest(query, ["sort", "page", "per_page"]);
        const { keyword, state } = filters;
        const paginateQuery = {};
        if (keyword) {
            paginateQuery.content = new RegExp(lodash_1.default.trim(keyword), 'i');
        }
        if (state != null) {
            paginateQuery.state = state;
        }
        return this.announcementService.paginator(paginateQuery, {
            page,
            perPage: per_page,
            dateSort: sort,
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
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_maybe_guard_1.AdminMaybeGuard),
    responser_decorator_1.Responser.paginate(),
    responser_decorator_1.Responser.handle('Get announcements'),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe, expose_pipe_1.ExposePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_dto_1.AnnouncementPaginateQueryDTO]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "getAnnouncements", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Create announcement'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_model_1.Announcement]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "createAnnouncement", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Delete announcements'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_dto_1.AnnouncementsDTO]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "delAnnouncements", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update announcement'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, announcement_model_1.Announcement]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "putAnnouncement", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Delete announcement'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnnouncementController.prototype, "delAnnouncement", null);
AnnouncementController = __decorate([
    (0, common_1.Controller)('announcement'),
    __metadata("design:paramtypes", [announcement_service_1.AnnouncementService])
], AnnouncementController);
exports.AnnouncementController = AnnouncementController;
//# sourceMappingURL=announcement.controller.js.map