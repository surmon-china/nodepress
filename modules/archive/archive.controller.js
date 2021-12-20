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
const auth_guard_1 = require("../../guards/auth.guard");
const http_decorator_1 = require("../../decorators/http.decorator");
const archive_service_1 = require("./archive.service");
let ArchiveController = class ArchiveController {
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
    http_decorator_1.HttpProcessor.handle('获取数据档案'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArchiveController.prototype, "getArchive", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('更新数据档案'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArchiveController.prototype, "updateArchive", null);
ArchiveController = __decorate([
    (0, common_1.Controller)('archive'),
    __metadata("design:paramtypes", [archive_service_1.ArchiveService])
], ArchiveController);
exports.ArchiveController = ArchiveController;
//# sourceMappingURL=archive.controller.js.map