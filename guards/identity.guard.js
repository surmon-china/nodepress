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
exports.IdentityGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const only_identity_decorator_1 = require("../decorators/only-identity.decorator");
let IdentityGuard = class IdentityGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const { identity } = context.switchToHttp().getRequest();
        const onlyRoles = this.reflector.getAllAndOverride(only_identity_decorator_1.METADATA_ONLY_IDENTITY_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (onlyRoles === undefined)
            return true;
        if (onlyRoles.includes(identity.role))
            return true;
        if (identity.isGuest) {
            throw new common_1.UnauthorizedException('Please login to access this resource');
        }
        else {
            throw new common_1.ForbiddenException('You do not have permission to access this resource');
        }
    }
};
exports.IdentityGuard = IdentityGuard;
exports.IdentityGuard = IdentityGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], IdentityGuard);
//# sourceMappingURL=identity.guard.js.map