"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtendValue = exports.getExtendsObject = void 0;
const getExtendsObject = (_extends) => {
    return _extends.length ? _extends.reduce((v, c) => (Object.assign(Object.assign({}, v), { [c.name]: c.value })), {}) : {};
};
exports.getExtendsObject = getExtendsObject;
const getExtendValue = (_extends, key) => {
    return _extends.length ? (0, exports.getExtendsObject)(_extends)[key] : void 0;
};
exports.getExtendValue = getExtendValue;
//# sourceMappingURL=extend.transformer.js.map