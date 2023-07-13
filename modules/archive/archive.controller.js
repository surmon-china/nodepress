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
exports.ArchiveController = void 0;
const common_1 = require("@nestjs/common");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const responser_decorator_1 = require("../../decorators/responser.decorator");
const archive_service_1 = require("./archive.service");
let ArchiveController = exports.ArchiveController = class ArchiveController {
    constructor(archiveService) {
        this.archiveService = archiveService;
    }
    getArchive() {
        return this.archiveService.getCache();
    }
    updateArchive() {
        return this.archiveService.updateCache();
    }
};
__decorate([
    (0, common_1.Get)(),
    responser_decorator_1.Responser.handle('Get archive'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArchiveController.prototype, "getArchive", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update archive cache'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArchiveController.prototype, "updateArchive", null);
exports.ArchiveController = ArchiveController = __decorate([
    (0, common_1.Controller)('archive'),
    __metadata("design:paramtypes", [archive_service_1.ArchiveService])
], ArchiveController);
//# sourceMappingURL=archive.controller.js.map