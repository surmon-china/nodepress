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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpansionController = void 0;
const common_1 = require("@nestjs/common");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_maybe_guard_1 = require("../../guards/admin-maybe.guard");
const responsor_decorator_1 = require("../../decorators/responsor.decorator");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const helper_service_cloud_storage_1 = require("../../processors/helper/helper.service.cloud-storage");
const helper_service_google_1 = require("../../processors/helper/helper.service.google");
const expansion_service_statistic_1 = require("./expansion.service.statistic");
const expansion_service_dbbackup_1 = require("./expansion.service.dbbackup");
let ExpansionController = class ExpansionController {
    constructor(googleService, dbBackupService, cloudStorageService, statisticService) {
        this.googleService = googleService;
        this.dbBackupService = dbBackupService;
        this.cloudStorageService = cloudStorageService;
        this.statisticService = statisticService;
    }
    getSystemStatistics({ isUnauthenticated }) {
        return this.statisticService.getStatistic(isUnauthenticated);
    }
    getCloudStorageUploadToken() {
        return this.cloudStorageService.getToken();
    }
    getGoogleToken() {
        return this.googleService.getCredentials();
    }
    updateDatabaseBackup() {
        return this.dbBackupService.backup();
    }
};
__decorate([
    (0, common_1.Get)('statistic'),
    (0, common_1.UseGuards)(admin_maybe_guard_1.AdminMaybeGuard),
    responsor_decorator_1.Responsor.handle('Get statistic'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpansionController.prototype, "getSystemStatistics", null);
__decorate([
    (0, common_1.Get)('uptoken'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responsor_decorator_1.Responsor.handle('Get cloud storage upload token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpansionController.prototype, "getCloudStorageUploadToken", null);
__decorate([
    (0, common_1.Get)('google-token'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responsor_decorator_1.Responsor.handle('Get Google credentials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpansionController.prototype, "getGoogleToken", null);
__decorate([
    (0, common_1.Patch)('database-backup'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responsor_decorator_1.Responsor.handle('Update database backup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExpansionController.prototype, "updateDatabaseBackup", null);
ExpansionController = __decorate([
    (0, common_1.Controller)('expansion'),
    __metadata("design:paramtypes", [helper_service_google_1.GoogleService,
        expansion_service_dbbackup_1.DBBackupService,
        helper_service_cloud_storage_1.CloudStorageService,
        expansion_service_statistic_1.StatisticService])
], ExpansionController);
exports.ExpansionController = ExpansionController;
//# sourceMappingURL=expansion.controller.js.map