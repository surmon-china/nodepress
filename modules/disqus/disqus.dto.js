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
exports.CommentIdDTO = exports.ThreadPostIdDTO = exports.CallbackCodeDTO = exports.ThreadStatus = void 0;
const class_validator_1 = require("class-validator");
var ThreadStatus;
(function (ThreadStatus) {
    ThreadStatus["Open"] = "open";
    ThreadStatus["Closed"] = "closed";
})(ThreadStatus || (exports.ThreadStatus = ThreadStatus = {}));
class CallbackCodeDTO {
    code;
}
exports.CallbackCodeDTO = CallbackCodeDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CallbackCodeDTO.prototype, "code", void 0);
class ThreadPostIdDTO {
    post_id;
}
exports.ThreadPostIdDTO = ThreadPostIdDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ThreadPostIdDTO.prototype, "post_id", void 0);
class CommentIdDTO {
    comment_id;
}
exports.CommentIdDTO = CommentIdDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CommentIdDTO.prototype, "comment_id", void 0);
//# sourceMappingURL=disqus.dto.js.map