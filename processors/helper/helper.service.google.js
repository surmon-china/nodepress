"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleService = void 0;
const googleapis_1 = require("googleapis");
const common_1 = require("@nestjs/common");
const error_transformer_1 = require("../../transformers/error.transformer");
const value_constant_1 = require("../../constants/value.constant");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger_1 = __importDefault(require("../../utils/logger"));
const log = logger_1.default.scope('GoogleAPI');
let GoogleService = class GoogleService {
    constructor() {
        this.jwtClient = null;
        this.initClient();
    }
    initClient() {
        var _a, _b;
        try {
            this.jwtClient = new googleapis_1.google.auth.JWT((_a = APP_CONFIG.GOOGLE.jwtServiceAccountCredentials) === null || _a === void 0 ? void 0 : _a.client_email, value_constant_1.UNDEFINED, (_b = APP_CONFIG.GOOGLE.jwtServiceAccountCredentials) === null || _b === void 0 ? void 0 : _b.private_key, [
                'https://www.googleapis.com/auth/indexing',
                'https://www.googleapis.com/auth/analytics.readonly',
            ], value_constant_1.UNDEFINED);
        }
        catch (error) {
            log.warn('client initialization failed!');
        }
    }
    getCredentials() {
        return new Promise((resolve, reject) => {
            if (!this.jwtClient) {
                return reject('GoogleAPI client initialization failed!');
            }
            this.jwtClient.authorize((error, credentials) => {
                const message = (0, error_transformer_1.getMessageFromNormalError)(error);
                if (message) {
                    log.warn('JWT authorize failed!', message);
                    reject(message);
                }
                resolve(credentials);
            });
        });
    }
};
GoogleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleService);
exports.GoogleService = GoogleService;
//# sourceMappingURL=helper.service.google.js.map