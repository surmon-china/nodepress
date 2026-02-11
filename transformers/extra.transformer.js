"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureExtra = exports.getExtraValue = exports.getExtrasMap = void 0;
const getExtrasMap = (kvs) => {
    return new Map((kvs ?? []).map((item) => [item.key, item.value]));
};
exports.getExtrasMap = getExtrasMap;
const getExtraValue = (extras, key) => {
    return extras?.find((extra) => extra.key === key)?.value;
};
exports.getExtraValue = getExtraValue;
const ensureExtra = (extras, key, value) => {
    if (extras.some((extra) => extra.key === key)) {
        return false;
    }
    else {
        extras.push({ key, value });
        return true;
    }
};
exports.ensureExtra = ensureExtra;
//# sourceMappingURL=extra.transformer.js.map