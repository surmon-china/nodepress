"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVoid = exports.isUndefined = exports.isNull = exports.UNDEFINED = exports.NULL = void 0;
exports.NULL = null;
exports.UNDEFINED = void 0;
const isNull = (value) => value === exports.NULL;
exports.isNull = isNull;
const isUndefined = (value) => value === exports.UNDEFINED;
exports.isUndefined = isUndefined;
const isVoid = (value) => (0, exports.isNull)(value) || (0, exports.isUndefined)(value);
exports.isVoid = isVoid;
//# sourceMappingURL=value.constant.js.map