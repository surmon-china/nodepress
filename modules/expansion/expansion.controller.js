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
exports.ExpansionController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../guards/auth.guard");
const http_decorator_1 = require("../../decorators/http.decorator");
const helper_service_cs_1 = require("../../processors/helper/helper.service.cs");
const helper_service_google_1 = require("../../processors/helper/helper.service.google");
const expansion_service_statistic_1 = require("./expansion.service.statistic");
const expansion_service_dbbackup_1 = require("./expansion.service.dbbackup");
let ExpansionController = class ExpansionController {
    constructor(googleService, statisticService, dbBackupService, cloudStorageService) {
        this.googleService = googleService;
        this.statisticService = statisticService;
        this.dbBackupService = dbBackupService;
        this.cloudStorageService = cloudStorageService;
    }
    getSystemStatistics() {
        return this.statisticService.getStatistic();
    }
    getCloudStorageUpToken() {
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
    http_decorator_1.HttpProcessor.handle('Get statistic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpansionController.prototype, "getSystemStatistics", null);
__decorate([
    (0, common_1.Get)('uptoken'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Get CS upload token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpansionController.prototype, "getCloudStorageUpToken", null);
__decorate([
    (0, common_1.Get)('google-token'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Get Google credentials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpansionController.prototype, "getGoogleToken", null);
__decorate([
    (0, common_1.Patch)('database-backup'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Update database backup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExpansionController.prototype, "updateDatabaseBackup", null);
ExpansionController = __decorate([
    (0, common_1.Controller)('expansion'),
    __metadata("design:paramtypes", [helper_service_google_1.GoogleService,
        expansion_service_statistic_1.StatisticService,
        expansion_service_dbbackup_1.DBBackupService,
        helper_service_cs_1.CloudStorageService])
], ExpansionController);
exports.ExpansionController = ExpansionController;
//# sourceMappingURL=expansion.controller.js.map