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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_optional_guard_1 = require("../../guards/admin-optional.guard");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const uploaded_file_decorator_1 = require("../../decorators/uploaded-file.decorator");
const helper_service_google_1 = require("../../core/helper/helper.service.google");
const helper_service_aws_1 = require("../../core/helper/helper.service.aws");
const extension_service_statistic_1 = require("./extension.service.statistic");
const extension_service_dbbackup_1 = require("./extension.service.dbbackup");
const APP_CONFIG = __importStar(require("../../app.config"));
let ExtensionController = class ExtensionController {
    awsService;
    googleService;
    dbBackupService;
    statisticService;
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
        return {
            ...result,
            files: result.files.map((file) => ({
                ...file,
                url: `${APP_CONFIG.APP_BIZ.STATIC_URL}/${file.key}`,
                lastModified: file.lastModified?.getTime()
            }))
        };
    }
    async uploadStaticFile(file) {
        if (!file.fields.key) {
            throw new common_2.BadRequestException('Missing required field: key');
        }
        const result = await this.awsService.uploadFile({
            key: file.fields.key,
            file: file.buffer,
            fileContentType: file.mimetype,
            region: APP_CONFIG.AWS.s3StaticRegion,
            bucket: APP_CONFIG.AWS.s3StaticBucket
        });
        return {
            ...result,
            url: `${APP_CONFIG.APP_BIZ.STATIC_URL}/${result.key}`
        };
    }
    googleAnalyticsBatchRunReports(requestBody) {
        return this.googleService.getAnalyticsDataClient().properties.batchRunReports({
            property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
            requestBody
        });
    }
    googleAnalyticsBatchRunPivotReports(requestBody) {
        return this.googleService.getAnalyticsDataClient().properties.batchRunPivotReports({
            property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
            requestBody
        });
    }
    googleAnalyticsRunRealtimeReport(requestBody) {
        return this.googleService.getAnalyticsDataClient().properties.runRealtimeReport({
            property: `properties/${APP_CONFIG.GOOGLE.analyticsV4PropertyId}`,
            requestBody
        });
    }
};
exports.ExtensionController = ExtensionController;
__decorate([
    (0, common_1.Get)('statistic'),
    (0, common_2.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get statistics succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExtensionController.prototype, "getSystemStatistics", null);
__decorate([
    (0, common_1.Patch)('database-backup'),
    (0, common_2.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update database backup succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExtensionController.prototype, "updateDatabaseBackup", null);
__decorate([
    (0, common_1.Get)('static/list'),
    (0, common_2.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get file list succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExtensionController.prototype, "getStaticFileList", null);
__decorate([
    (0, common_1.Post)('static/upload'),
    (0, common_2.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Upload file to cloud storage succeeded'),
    __param(0, (0, uploaded_file_decorator_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExtensionController.prototype, "uploadStaticFile", null);
__decorate([
    (0, common_1.Post)('google-analytics/batch-run-reports'),
    (0, common_2.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Google analytics batchRunReports succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtensionController.prototype, "googleAnalyticsBatchRunReports", null);
__decorate([
    (0, common_1.Post)('google-analytics/batch-run-pivot-reports'),
    (0, common_2.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Google analytics batchRunPivotReports succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtensionController.prototype, "googleAnalyticsBatchRunPivotReports", null);
__decorate([
    (0, common_1.Post)('google-analytics/run-realtime-report'),
    (0, common_2.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Google analytics runRealtimeReport succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExtensionController.prototype, "googleAnalyticsRunRealtimeReport", null);
exports.ExtensionController = ExtensionController = __decorate([
    (0, common_2.Controller)('extension'),
    __metadata("design:paramtypes", [helper_service_aws_1.AWSService,
        helper_service_google_1.GoogleService,
        extension_service_dbbackup_1.DBBackupService,
        extension_service_statistic_1.StatisticService])
], ExtensionController);
//# sourceMappingURL=extension.controller.js.map