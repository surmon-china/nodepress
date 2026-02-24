"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownToDate = unknownToDate;
exports.unknownToNumber = unknownToNumber;
exports.unknownToBoolean = unknownToBoolean;
const class_validator_1 = require("class-validator");
function unknownToDate(value) {
    return (0, class_validator_1.isDateString)(value) ? new Date(value) : value;
}
function unknownToNumber(value) {
    return (0, class_validator_1.isNumberString)(value) ? Number(value) : value;
}
function unknownToBoolean(value) {
    if ([true, 'true', 1, '1'].includes(value))
        return true;
    if ([false, 'false', 0, '0'].includes(value))
        return false;
    return value;
}
//# sourceMappingURL=value.transformer.js.map