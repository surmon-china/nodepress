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
exports.PermissionPipe = void 0;
const lodash_1 = require("lodash");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const text_constant_1 = require("../constants/text.constant");
const forbidden_error_1 = require("../errors/forbidden.error");
const guest_decorator_1 = require("../decorators/guest.decorator");
let PermissionPipe = class PermissionPipe {
    constructor(request) {
        this.request = request;
    }
    transform(value) {
        if (this.request.isAuthenticated()) {
            return value;
        }
        const guestRequestOptions = (0, guest_decorator_1.getGuestRequestOptions)(value);
        if (!guestRequestOptions) {
            return value;
        }
        Object.keys(value).forEach((field) => {
            var _a;
            const v = value[field];
            const o = guestRequestOptions[field];
            if ((_a = o === null || o === void 0 ? void 0 : o.only) === null || _a === void 0 ? void 0 : _a.length) {
                if (!o.only.includes(v)) {
                    const message = `${text_constant_1.HTTP_PARAMS_PERMISSION_ERROR_DEFAULT}: '${field}=${v}'`;
                    const description = `'${field}' must be one of the following values: ${o.only.join(', ')}`;
                    throw new forbidden_error_1.HttpForbiddenError(`${message}, ${description}`);
                }
            }
        });
        Object.keys(guestRequestOptions).forEach((field) => {
            const v = value[field];
            const o = guestRequestOptions[field];
            if (o === null || o === void 0 ? void 0 : o.default) {
                if ((0, lodash_1.isUndefined)(v)) {
                    value[field] = o.default;
                }
            }
        });
        return value;
    }
};
PermissionPipe = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], PermissionPipe);
exports.PermissionPipe = PermissionPipe;
//# sourceMappingURL=permission.pipe.js.map