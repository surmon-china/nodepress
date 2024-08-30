"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_maybe_guard_1 = require("../../guards/admin-maybe.guard");
const responser_decorator_1 = require("../../decorators/responser.decorator");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const helper_service_google_1 = require("../../processors/helper/helper.service.google");
const helper_service_aws_1 = require("../../processors/helper/helper.service.aws");
const extension_service_statistic_1 = require("./extension.service.statistic");
const extension_service_dbbackup_1 = require("./extension.service.dbbackup");
const APP_CONFIG = __importStar(require("../../app.config"));
let ExtensionController = class ExtensionController {
    constructor(awsService, googleService, dbBackupService, statisticService) {
        this.awsService = awsService;
        this.googleService = googleService;
        this.dbBackupService = dbBackupService;
        this.statisticService = statisticService;
    }
    getSystemStatistics({ isUnauthenticated }) {
        return this.statisticService.getStatistic(isUnauthenticated);
    }
    updateDatabaseBackup() {
        return this.dbBackupService.backup();
    }
    async getStaticFileList({ query }) {
        const minLimit = 200;
        const numberLimit = Number(query.limit);
        const limit = Number.isInteger(numberLimit) ? numberLimit : minLimit;
        const result = await this.awsService.getFileList({
            limit: limit < minLimit ? minLimit : limit,
            prefix: query.prefix,
            startAfter: query.startAfter,
            delimiter: query.delimiter,
            region: APP_CONFIG.AWS.s3StaticRegion,
            bucket: APP_CONFIG.AWS.s3StaticBucket
        });
        return Object.assign(Object.assign({}, result), { files: result.files.map((file) => {
                var _a;
                return (Object.assign(Object.assign({}, file), { url: `${APP_CONFIG.APP.STATIC_URL}/${file.key}`, lastModified: (_a = file.lastModified) === null || _a === void 0 ? void 0 : _a.getTime() }));
            }) });
    }
    async uploadStaticFile(file, body) {
        const result = await this.awsService.uploadFile({
            name: body.name,
            file: file.buffer,
            fileContentType: file.mimetype,
            region: APP_CONFIG.AWS.s3StaticRegion,
            bucket: APP_CONFIG.AWS.s3StaticBucket
        });
        return Object.assign(Object.assign({}, result), { url: `${APP_CONFIG.APP.STATIC_URL}/${result.key}` });
    }
    googleAnalyticsBatchRunReports(requestBody) {
        return this.googleService.getAnalyticsData().properties.batchRunReports({
            property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
            requestBody
        });
    }
    googleAnalyticsBatchRunPivotReports(requestBody) {
        return this.googleService.getAnalyticsData().properties.batchRunPivotReports({
            property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
            requestBody
        });
    }
    googleAnalyticsRunRealtimeReport(requestBody) {
        return this.googleService.getAnalyticsData().properties.runRealtimeReport({
            property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
            requestBody
        });
    }
};
exports.ExtensionController = ExtensionController;
__decorate([
    (0, common_1.Get)('statistic'),
    (0, common_1.UseGuards)(admin_maybe_guard_1.AdminMaybeGuard),
    responser_decorator_1.Responser.handle('Get statistics'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExtensionController.prototype, "getSystemStatistics", null);
__decorate([
    (0, common_1.Patch)('database-backup'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update database backup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExtensionController.prototype, "updateDatabaseBackup", null);
__decorate([
    (0, common_1.Get)('static/list'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Get file list from cloud storage'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExtensionController.prototype, "getStaticFileList", null);
__decorate([
    (0, common_1.Post)('static/upload'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    responser_decorator_1.Responser.handle('Upload file to cloud storage'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExtensionController.prototype, "uploadStaticFile", null);
__decorate([
    (0, common_1.Post)('google-analytics/batch-run-reports'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Google analytics batchRunReports'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtensionController.prototype, "googleAnalyticsBatchRunReports", null);
__decorate([
    (0, common_1.Post)('google-analytics/batch-run-pivot-reports'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Google analytics batchRunPivotReports'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtensionController.prototype, "googleAnalyticsBatchRunPivotReports", null);
__decorate([
    (0, common_1.Post)('google-analytics/run-realtime-report'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Google analytics runRealtimeReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtensionController.prototype, "googleAnalyticsRunRealtimeReport", null);
exports.ExtensionController = ExtensionController = __decorate([
    (0, common_1.Controller)('extension'),
    __metadata("design:paramtypes", [helper_service_aws_1.AWSService,
        helper_service_google_1.GoogleService,
        extension_service_dbbackup_1.DBBackupService,
        extension_service_statistic_1.StatisticService])
], ExtensionController);
//# sourceMappingURL=extension.controller.js.map