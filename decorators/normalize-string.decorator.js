"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeString = normalizeString;
exports.NormalizeString = NormalizeString;
const class_transformer_1 = require("class-transformer");
function normalizeString(value, options = {}) {
    if (typeof value !== 'string')
        return value;
    const { trim = false, collapseSpaces = false } = options;
    let result = value;
    if (trim)
        result = result.trim();
    if (collapseSpaces)
        result = result.replace(/\s+/g, ' ');
    return result;
}
function NormalizeString(options, transformOptions) {
    return (0, class_transformer_1.Transform)(({ value }) => normalizeString(value, options), transformOptions);
}
//# sourceMappingURL=normalize-string.decorator.js.map