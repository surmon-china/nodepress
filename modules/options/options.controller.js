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
exports.OptionsController = void 0;
const common_1 = require("@nestjs/common");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_optional_guard_1 = require("../../guards/admin-optional.guard");
const options_service_1 = require("./options.service");
const options_model_1 = require("./options.model");
let OptionsController = class OptionsController {
    optionsService;
    constructor(optionsService) {
        this.optionsService = optionsService;
    }
    getOptions({ isAuthenticated }) {
        return isAuthenticated ? this.optionsService.ensureAppOptions() : this.optionsService.getOptionsCacheForGuest();
    }
    putOptions(options) {
        return this.optionsService.putOptions(options);
    }
};
exports.OptionsController = OptionsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get app options succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OptionsController.prototype, "getOptions", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update app options succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [options_model_1.Option]),
    __metadata("design:returntype", Promise)
], OptionsController.prototype, "putOptions", null);
exports.OptionsController = OptionsController = __decorate([
    (0, common_1.Controller)('options'),
    __metadata("design:paramtypes", [options_service_1.OptionsService])
], OptionsController);
//# sourceMappingURL=options.controller.js.map