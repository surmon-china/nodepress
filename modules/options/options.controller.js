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
const event_emitter_1 = require("@nestjs/event-emitter");
const common_1 = require("@nestjs/common");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const events_constant_1 = require("../../constants/events.constant");
const options_service_1 = require("./options.service");
const options_dto_1 = require("./options.dto");
let OptionsController = class OptionsController {
    eventEmitter;
    optionsService;
    constructor(eventEmitter, optionsService) {
        this.eventEmitter = eventEmitter;
        this.optionsService = optionsService;
    }
    getOptions({ identity }) {
        return identity.isAdmin ? this.optionsService.ensureOptions() : this.optionsService.getPublicOptionsCache();
    }
    async updateOptions(dto) {
        const updated = await this.optionsService.updateOptions(dto);
        this.eventEmitter.emit(events_constant_1.EventKeys.OptionsUpdated, updated);
        return updated;
    }
};
exports.OptionsController = OptionsController;
__decorate([
    (0, common_1.Get)(),
    (0, success_response_decorator_1.SuccessResponse)('Get app options succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OptionsController.prototype, "getOptions", null);
__decorate([
    (0, common_1.Patch)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update app options succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [options_dto_1.UpdateOptionsDto]),
    __metadata("design:returntype", Promise)
], OptionsController.prototype, "updateOptions", null);
exports.OptionsController = OptionsController = __decorate([
    (0, common_1.Controller)('options'),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        options_service_1.OptionsService])
], OptionsController);
//# sourceMappingURL=options.controller.js.map