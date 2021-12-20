"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.AuthService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const model_transformer_1 = require("../../transformers/model.transformer");
const codec_transformer_1 = require("../../transformers/codec.transformer");
const mongoose_interface_1 = require("../../interfaces/mongoose.interface");
const auth_model_1 = require("./auth.model");
const APP_CONFIG = __importStar(require("../../app.config"));
let AuthService = class AuthService {
    constructor(jwtService, authModel) {
        this.jwtService = jwtService;
        this.authModel = authModel;
    }
    getExtantPassword(auth) {
        return (auth === null || auth === void 0 ? void 0 : auth.password) || (0, codec_transformer_1.decodeMd5)(APP_CONFIG.AUTH.defaultPassword);
    }
    createToken() {
        return {
            access_token: this.jwtService.sign({ data: APP_CONFIG.AUTH.data }),
            expires_in: APP_CONFIG.AUTH.expiresIn,
        };
    }
    validateAuthData(payload) {
        const isVerified = lodash_1.default.isEqual(payload.data, APP_CONFIG.AUTH.data);
        return isVerified ? payload.data : null;
    }
    getAdminInfo() {
        return this.authModel.findOne().exec();
    }
    async putAdminInfo(auth) {
        const password = (0, codec_transformer_1.decodeBase64)(auth.password);
        const new_password = (0, codec_transformer_1.decodeBase64)(auth.new_password);
        Reflect.deleteProperty(auth, 'password');
        Reflect.deleteProperty(auth, 'new_password');
        if (password || new_password) {
            if (!password || !new_password) {
                throw '密码不完整或无效';
            }
            if (password === new_password) {
                throw '新旧密码不可一致';
            }
        }
        const extantAuth = await this.authModel.findOne(null, '+password').exec();
        if (password) {
            const oldPassword = (0, codec_transformer_1.decodeMd5)(password);
            const extantPassword = this.getExtantPassword(extantAuth);
            if (oldPassword !== extantPassword) {
                throw '原密码不正确';
            }
            else {
                auth.password = (0, codec_transformer_1.decodeMd5)(new_password);
            }
        }
        const newAuthData = await (extantAuth && !!extantAuth._id
            ? Object.assign(extantAuth, auth).save()
            : this.authModel.create(auth));
        const authData = newAuthData.toObject();
        Reflect.deleteProperty(authData, 'password');
        return authData;
    }
    async adminLogin(password) {
        const auth = await this.authModel.findOne(null, '+password').exec();
        const extantPassword = this.getExtantPassword(auth);
        const loginPassword = (0, codec_transformer_1.decodeMd5)((0, codec_transformer_1.decodeBase64)(password));
        if (loginPassword === extantPassword) {
            return this.createToken();
        }
        else {
            throw '密码不匹配';
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(auth_model_1.Auth)),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map