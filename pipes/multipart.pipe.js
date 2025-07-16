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
exports.MultipartValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
let MultipartValidationPipe = class MultipartValidationPipe {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    async transform(file) {
        const validatorFile = {
            mimetype: file.mimetype,
            size: file.fileSize,
            buffer: file.buffer
        };
        if (this.options.allowedType) {
            const typeValidator = new common_1.FileTypeValidator({ fileType: this.options.allowedType });
            if (!(await typeValidator.isValid(validatorFile))) {
                throw new common_2.UnprocessableEntityException(typeValidator.buildErrorMessage(validatorFile));
            }
        }
        if (this.options.maxFileSize) {
            const sizeValidator = new common_1.MaxFileSizeValidator({ maxSize: this.options.maxFileSize });
            if (!(await sizeValidator.isValid(validatorFile))) {
                throw new common_2.PayloadTooLargeException(sizeValidator.buildErrorMessage(validatorFile));
            }
        }
        return file;
    }
};
exports.MultipartValidationPipe = MultipartValidationPipe;
exports.MultipartValidationPipe = MultipartValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], MultipartValidationPipe);
//# sourceMappingURL=multipart.pipe.js.map