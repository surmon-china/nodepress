"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageFromNormalError = getMessageFromNormalError;
exports.getMessageFromAxiosError = getMessageFromAxiosError;
function getMessageFromNormalError(error) {
    return error?.message || error;
}
function getMessageFromAxiosError(error) {
    return error?.response?.data || getMessageFromNormalError(error);
}
//# sourceMappingURL=error.transformer.js.map