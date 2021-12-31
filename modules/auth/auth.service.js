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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const value_constant_1 = require("../../constants/value.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const codec_transformer_1 = require("../../transformers/codec.transformer");
const auth_model_1 = require("./auth.model");
const APP_CONFIG = __importStar(require("../../app.config"));
let AuthService = class AuthService {
    constructor(jwtService, authModel) {
        this.jwtService = jwtService;
        this.authModel = authModel;
    }
    async getExistedPassword() {
        const auth = await this.authModel.findOne(value_constant_1.UNDEFINED, '+password').exec();
        return (auth === null || auth === void 0 ? void 0 : auth.password) || (0, codec_transformer_1.decodeMD5)(APP_CONFIG.AUTH.defaultPassword);
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
    async getAdminInfo() {
        const adminInfo = await this.authModel.findOne(value_constant_1.UNDEFINED, '-_id').exec();
        return adminInfo ? adminInfo.toObject() : auth_model_1.DEFAULT_AUTH;
    }
    async putAdminInfo(auth) {
        const { password, new_password } = auth, restAuth = __rest(auth, ["password", "new_password"]);
        let newPassword;
        if (password || new_password) {
            if (!password || !new_password) {
                throw 'Incomplete passwords';
            }
            if (password === new_password) {
                throw 'Old password and new password cannot be same';
            }
            const oldPassword = (0, codec_transformer_1.decodeMD5)((0, codec_transformer_1.decodeBase64)(password));
            const existedPassword = await this.getExistedPassword();
            if (oldPassword !== existedPassword) {
                throw 'Old password incorrect';
            }
            else {
                newPassword = (0, codec_transformer_1.decodeMD5)((0, codec_transformer_1.decodeBase64)(new_password));
            }
        }
        const targetAuthData = Object.assign({}, restAuth);
        if (newPassword) {
            targetAuthData.password = newPassword;
        }
        const existedAuth = await this.authModel.findOne(value_constant_1.UNDEFINED, '+password').exec();
        if (existedAuth) {
            await Object.assign(existedAuth, targetAuthData).save();
        }
        else {
            await this.authModel.create(targetAuthData);
        }
        return this.getAdminInfo();
    }
    async adminLogin(password) {
        const existedPassword = await this.getExistedPassword();
        const loginPassword = (0, codec_transformer_1.decodeMD5)((0, codec_transformer_1.decodeBase64)(password));
        if (loginPassword === existedPassword) {
            return this.createToken();
        }
        else {
            throw 'Password incorrect';
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