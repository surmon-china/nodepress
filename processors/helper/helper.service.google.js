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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleService = void 0;
const googleapis_1 = require("googleapis");
const common_1 = require("@nestjs/common");
const error_transformer_1 = require("../../transformers/error.transformer");
const value_constant_1 = require("../../constants/value.constant");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger = (0, logger_1.createLogger)({ scope: 'GoogleAPIService', time: app_environment_1.isDevEnv });
let GoogleService = class GoogleService {
    constructor() {
        var _a, _b;
        this.authJWT = null;
        this.analyticsData = null;
        try {
            this.authJWT = new googleapis_1.google.auth.JWT((_a = APP_CONFIG.GOOGLE.jwtServiceAccountCredentials) === null || _a === void 0 ? void 0 : _a.client_email, value_constant_1.UNDEFINED, (_b = APP_CONFIG.GOOGLE.jwtServiceAccountCredentials) === null || _b === void 0 ? void 0 : _b.private_key, [
                'https://www.googleapis.com/auth/indexing',
                'https://www.googleapis.com/auth/analytics.readonly'
            ], value_constant_1.UNDEFINED);
            this.analyticsData = googleapis_1.google.analyticsdata({
                version: 'v1beta',
                auth: this.authJWT
            });
        }
        catch (error) {
            logger.failure('authJWT initialization failed!', error);
        }
    }
    getAuthCredentials() {
        return new Promise((resolve, reject) => {
            if (!this.authJWT) {
                reject('GoogleAPI authJWT initialization failed!');
            }
            else {
                this.authJWT.authorize((error, credentials) => {
                    const message = (0, error_transformer_1.getMessageFromNormalError)(error);
                    if (message) {
                        logger.warn('authJWT authorize failed!', message);
                        reject(message);
                    }
                    else {
                        resolve(credentials);
                    }
                });
            }
        });
    }
    getAnalyticsData() {
        if (!this.authJWT || !this.analyticsData) {
            throw new Error('GoogleAPI analyticsData initialization failed!');
        }
        else {
            return this.analyticsData;
        }
    }
};
exports.GoogleService = GoogleService;
exports.GoogleService = GoogleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleService);
//# sourceMappingURL=helper.service.google.js.map