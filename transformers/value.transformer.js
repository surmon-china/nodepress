"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknowToDate = exports.numberToBoolean = exports.unknowToNumber = void 0;
const class_validator_1 = require("class-validator");
function unknowToNumber(value) {
    return (0, class_validator_1.isNumberString)(value) ? Number(value) : value;
}
exports.unknowToNumber = unknowToNumber;
function numberToBoolean(value) {
    return (0, class_validator_1.isNumber)(value, {
        allowNaN: false,
        allowInfinity: false,
    })
        ? Boolean(value)
        : value;
}
exports.numberToBoolean = numberToBoolean;
function unknowToDate(value) {
    return (0, class_validator_1.isDateString)(value) ? new Date(value) : value;
}
exports.unknowToDate = unknowToDate;
//# sourceMappingURL=value.transformer.js.map