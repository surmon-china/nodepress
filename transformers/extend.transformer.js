"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtendValue = exports.getExtendObject = void 0;
const getExtendObject = (_extends) => {
    return _extends.length ? _extends.reduce((v, c) => ({ ...v, [c.name]: c.value }), {}) : {};
};
exports.getExtendObject = getExtendObject;
const getExtendValue = (_extends, key) => {
    return _extends.length ? (0, exports.getExtendObject)(_extends)[key] : undefined;
};
exports.getExtendValue = getExtendValue;
//# sourceMappingURL=extend.transformer.js.map