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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const common_1 = require("@nestjs/common");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const user_dto_1 = require("./user.dto");
const user_constant_1 = require("./user.constant");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    getUsers(query) {
        const { sort, page, per_page, ...filters } = query;
        const queryFilter = {};
        const paginateOptions = { page, perPage: per_page };
        if (!(0, isUndefined_1.default)(sort)) {
            paginateOptions.dateSort = sort;
        }
        if (!(0, isUndefined_1.default)(filters.type)) {
            queryFilter.type = filters.type;
        }
        if (!(0, isUndefined_1.default)(filters.disabled)) {
            queryFilter.disabled = filters.disabled;
        }
        if (filters.keyword) {
            queryFilter.$or = [
                { name: { $regex: filters.keyword, $options: 'i' } },
                { email: { $regex: filters.keyword, $options: 'i' } },
                { website: { $regex: filters.keyword, $options: 'i' } }
            ];
        }
        return this.userService.paginate(queryFilter, paginateOptions);
    }
    createUser(dto) {
        return this.userService.create(dto);
    }
    getUser(id) {
        return this.userService.findOne(id);
    }
    updateUser(id, dto) {
        return this.userService.update(id, dto);
    }
    deleteUser(id) {
        return this.userService.delete(id);
    }
    deleteUserIdentity(userId, provider) {
        return this.userService.pullIdentity(userId, provider);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get users succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserPaginateQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)(),
    (0, success_response_decorator_1.SuccessResponse)('Create user succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, success_response_decorator_1.SuccessResponse)('Get user succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, success_response_decorator_1.SuccessResponse)('Update user succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, success_response_decorator_1.SuccessResponse)('Delete user succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Delete)(':id/identities/:provider'),
    (0, success_response_decorator_1.SuccessResponse)('Delete user identity succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUserIdentity", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map