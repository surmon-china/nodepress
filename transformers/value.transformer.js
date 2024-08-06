"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownToNumber = unknownToNumber;
exports.unknownToBoolean = unknownToBoolean;
exports.unknownToDate = unknownToDate;
exports.numberToBoolean = numberToBoolean;
const class_validator_1 = require("class-validator");
function unknownToNumber(value) {
    return (0, class_validator_1.isNumberString)(value) ? Number(value) : value;
}
function unknownToBoolean(value) {
    return (0, class_validator_1.isBooleanString)(value) ? JSON.parse(value) : value;
}
function unknownToDate(value) {
    return (0, class_validator_1.isDateString)(value) ? new Date(value) : value;
}
function numberToBoolean(value) {
    return (0, class_validator_1.isNumber)(value, {
        allowNaN: false,
        allowInfinity: false
    })
        ? Boolean(value)
        : value;
}
//# sourceMappingURL=value.transformer.js.map