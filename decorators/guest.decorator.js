"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuestRequestOptions = void 0;
exports.WhenGuest = WhenGuest;
const common_1 = require("@nestjs/common");
const reflector_constant_1 = require("../constants/reflector.constant");
const meta_constant_1 = require("../constants/meta.constant");
function WhenGuest(option) {
    return (target, propertyName) => {
        (0, common_1.SetMetadata)(meta_constant_1.GUEST_REQUEST_METADATA, Object.assign(Object.assign({}, reflector_constant_1.reflector.get(meta_constant_1.GUEST_REQUEST_METADATA, target)), { [propertyName]: option }))(target);
    };
}
const getGuestRequestOptions = (target) => {
    return reflector_constant_1.reflector.get(meta_constant_1.GUEST_REQUEST_METADATA, target);
};
exports.getGuestRequestOptions = getGuestRequestOptions;
//# sourceMappingURL=guest.decorator.js.map