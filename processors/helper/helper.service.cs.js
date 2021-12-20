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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudStorageService = void 0;
const ali_oss_1 = __importDefault(require("ali-oss"));
const common_1 = require("@nestjs/common");
const APP_CONFIG = __importStar(require("../../app.config"));
const STS = ali_oss_1.default.STS;
let CloudStorageService = class CloudStorageService {
    constructor() {
        this.sts = new STS({
            accessKeyId: APP_CONFIG.ALIYUN_CLOUD_STORAGE.accessKey,
            accessKeySecret: APP_CONFIG.ALIYUN_CLOUD_STORAGE.secretKey,
        });
    }
    async getToken() {
        const response = await this.sts.assumeRole(APP_CONFIG.ALIYUN_CLOUD_STORAGE.aliyunAcsARN, null, 15 * 60, 'session-name');
        return response.credentials;
    }
    async uploadFile(name, file, region, bucket) {
        return this.getToken().then((token) => {
            let client = new ali_oss_1.default({
                region,
                bucket,
                accessKeyId: token.AccessKeyId,
                accessKeySecret: token.AccessKeySecret,
                stsToken: token.SecurityToken,
                secure: true,
            });
            return client.put(name, file).finally(() => {
                client = null;
            });
        });
    }
};
CloudStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudStorageService);
exports.CloudStorageService = CloudStorageService;
//# sourceMappingURL=helper.service.cs.js.map