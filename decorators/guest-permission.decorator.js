"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuestRequestPermission = void 0;
exports.WithGuestPermission = WithGuestPermission;
const common_1 = require("@nestjs/common");
const reflector_constant_1 = require("../constants/reflector.constant");
const METADATA_GUEST_PERMISSION_PREFIX = 'app:guest_request_permission';
const getGuestRequestPermission = (target, propertyKey) => {
    return reflector_constant_1.reflector.get(`${METADATA_GUEST_PERMISSION_PREFIX}:${propertyKey}`, target);
};
exports.getGuestRequestPermission = getGuestRequestPermission;
function WithGuestPermission(permission) {
    return (target, propertyKey) => {
        (0, common_1.SetMetadata)(`${METADATA_GUEST_PERMISSION_PREFIX}:${propertyKey}`, permission)(target);
    };
}
//# sourceMappingURL=guest-permission.decorator.js.map