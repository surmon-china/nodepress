"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMaybeGuard = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const unauthorized_error_1 = require("../errors/unauthorized.error");
const value_constant_1 = require("../constants/value.constant");
let AdminMaybeGuard = class AdminMaybeGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(error, authInfo, errInfo) {
        const validToken = Boolean(authInfo);
        const emptyToken = !authInfo && (errInfo === null || errInfo === void 0 ? void 0 : errInfo.message) === 'No auth token';
        if (!error && (validToken || emptyToken)) {
            return authInfo;
        }
        else {
            throw error || new unauthorized_error_1.HttpUnauthorizedError(value_constant_1.UNDEFINED, errInfo === null || errInfo === void 0 ? void 0 : errInfo.message);
        }
    }
};
AdminMaybeGuard = __decorate([
    (0, common_1.Injectable)()
], AdminMaybeGuard);
exports.AdminMaybeGuard = AdminMaybeGuard;
//# sourceMappingURL=admin-maybe.guard.js.map