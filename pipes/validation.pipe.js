"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationPipe = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
const validation_error_1 = require("../errors/validation.error");
let ValidationPipe = class ValidationPipe {
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
    async transform(value, { metatype }) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToClass)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            const messages = [];
            const pushMessage = (constraints = {}) => {
                messages.push(...Object.values(constraints));
            };
            errors.forEach((error) => {
                if (error.constraints) {
                    pushMessage(error.constraints);
                }
                if (error.children) {
                    error.children.forEach((e) => pushMessage(e.constraints));
                }
            });
            throw new validation_error_1.ValidationError(messages.join('; '));
        }
        return value;
    }
};
ValidationPipe = __decorate([
    (0, common_1.Injectable)()
], ValidationPipe);
exports.ValidationPipe = ValidationPipe;
//# sourceMappingURL=validation.pipe.js.map