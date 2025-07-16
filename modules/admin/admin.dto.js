"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUpdateDTO = exports.AuthLoginDTO = void 0;
const class_validator_1 = require("class-validator");
const admin_model_1 = require("./admin.model");
class AuthLoginDTO {
    password;
}
exports.AuthLoginDTO = AuthLoginDTO;
__decorate([
    (0, class_validator_1.IsString)({ message: 'password must be string type' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'password?' }),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], AuthLoginDTO.prototype, "password", void 0);
class AdminUpdateDTO extends admin_model_1.Admin {
    new_password;
}
exports.AdminUpdateDTO = AdminUpdateDTO;
//# sourceMappingURL=admin.dto.js.map