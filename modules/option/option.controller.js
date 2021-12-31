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
exports.OptionController = void 0;
const common_1 = require("@nestjs/common");
const query_params_decorator_1 = require("../../decorators/query-params.decorator");
const http_decorator_1 = require("../../decorators/http.decorator");
const auth_guard_1 = require("../../guards/auth.guard");
const humanized_auth_guard_1 = require("../../guards/humanized-auth.guard");
const option_service_1 = require("./option.service");
const option_model_1 = require("./option.model");
let OptionController = class OptionController {
    constructor(optionService) {
        this.optionService = optionService;
    }
    getOption({ isAuthenticated }) {
        return isAuthenticated ? this.optionService.getAppOption() : this.optionService.getOptionUserCache();
    }
    putOption(option) {
        return this.optionService.putOption(option);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(humanized_auth_guard_1.HumanizedJwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Get site options'),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OptionController.prototype, "getOption", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Update site options'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [option_model_1.Option]),
    __metadata("design:returntype", Promise)
], OptionController.prototype, "putOption", null);
OptionController = __decorate([
    (0, common_1.Controller)('option'),
    __metadata("design:paramtypes", [option_service_1.OptionService])
], OptionController);
exports.OptionController = OptionController;
//# sourceMappingURL=option.controller.js.map