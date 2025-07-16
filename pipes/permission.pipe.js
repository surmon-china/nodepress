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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionPipe = void 0;
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const common_1 = require("@nestjs/common");
const guest_permission_decorator_1 = require("../decorators/guest-permission.decorator");
const core_1 = require("@nestjs/core");
let PermissionPipe = class PermissionPipe {
    request;
    constructor(request) {
        this.request = request;
    }
    transform(value) {
        if (this.request.locals.isAuthenticated) {
            return value;
        }
        Object.keys(value).forEach((field) => {
            const fieldValue = value[field];
            const fieldMeta = (0, guest_permission_decorator_1.getGuestRequestPermission)(value, field);
            if (!(0, isUndefined_1.default)(fieldValue)) {
                if (fieldMeta?.only?.length && !fieldMeta.only.includes(fieldValue)) {
                    throw new common_1.ForbiddenException(`Invalid value for field '${field}': allowed values are [${fieldMeta.only.join(', ')}]`);
                }
            }
            if ((0, isUndefined_1.default)(fieldValue) && !(0, isUndefined_1.default)(fieldMeta?.default)) {
                value[field] = fieldMeta.default;
            }
        });
        this.request.locals.validatedQueryParams = { ...value };
        return value;
    }
};
exports.PermissionPipe = PermissionPipe;
exports.PermissionPipe = PermissionPipe = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], PermissionPipe);
//# sourceMappingURL=permission.pipe.js.map