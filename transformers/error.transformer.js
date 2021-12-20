"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageFromAxiosError = exports.getMessageFromNormalError = void 0;
function getMessageFromNormalError(error) {
    return (error === null || error === void 0 ? void 0 : error.message) || error;
}
exports.getMessageFromNormalError = getMessageFromNormalError;
function getMessageFromAxiosError(error) {
    var _a;
    return ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || getMessageFromNormalError(error);
}
exports.getMessageFromAxiosError = getMessageFromAxiosError;
//# sourceMappingURL=error.transformer.js.map