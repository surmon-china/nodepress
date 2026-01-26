"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtraValue = exports.getExtraObject = void 0;
const getExtraObject = (extras) => {
    return extras.length ? extras.reduce((pv, cv) => ({ ...pv, [cv.key]: cv.value }), {}) : {};
};
exports.getExtraObject = getExtraObject;
const getExtraValue = (extras, key) => {
    return extras.length ? (0, exports.getExtraObject)(extras)[key] : undefined;
};
exports.getExtraValue = getExtraValue;
//# sourceMappingURL=extra.transformer.js.map