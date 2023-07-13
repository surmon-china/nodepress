"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownToDate = exports.numberToBoolean = exports.unknownToNumber = void 0;
const class_validator_1 = require("class-validator");
function unknownToNumber(value) {
    return (0, class_validator_1.isNumberString)(value) ? Number(value) : value;
}
exports.unknownToNumber = unknownToNumber;
function numberToBoolean(value) {
    return (0, class_validator_1.isNumber)(value, {
        allowNaN: false,
        allowInfinity: false
    })
        ? Boolean(value)
        : value;
}
exports.numberToBoolean = numberToBoolean;
function unknownToDate(value) {
    return (0, class_validator_1.isDateString)(value) ? new Date(value) : value;
}
exports.unknownToDate = unknownToDate;
//# sourceMappingURL=value.transformer.js.map