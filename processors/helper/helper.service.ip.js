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
exports.IPService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const error_transformer_1 = require("../../transformers/error.transformer");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger_1 = __importDefault(require("../../utils/logger"));
let IPService = class IPService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    queryIPByAliyun(ip) {
        return this.httpService.axiosRef
            .request({
            headers: {
                Authorization: `APPCODE ${APP_CONFIG.COMMON_SERVICE.aliyunIPAuth}`,
            },
            url: `https://api01.aliyun.venuscn.com/ip?ip=${ip}`,
        })
            .then((response) => {
            var _a;
            if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.ret) === 200) {
                return Promise.resolve(response.data.data);
            }
            else {
                return Promise.reject(response.data);
            }
        })
            .catch((error) => {
            const message = (0, error_transformer_1.getMessageFromAxiosError)(error);
            logger_1.default.warn('[IP Query]', 'Aliyun 查询 IP 信息失败！', message);
            return Promise.reject(message);
        });
    }
    queryIPByJUHE(ip) {
        return this.httpService.axiosRef
            .get(`http://apis.juhe.cn/ip/ipNew?ip=${ip}&key=${APP_CONFIG.COMMON_SERVICE.juheIPAuth}`)
            .then((response) => {
            var _a;
            if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.resultcode) === '200') {
                return Promise.resolve(response.data.result);
            }
            else {
                return Promise.reject(response.data);
            }
        })
            .catch((error) => {
            const message = (0, error_transformer_1.getMessageFromAxiosError)(error);
            logger_1.default.warn('[IP Query]', 'juhe.cn 查询 IP 信息失败！', message);
            return Promise.reject(message);
        });
    }
    query(ip) {
        return this.queryIPByJUHE(ip)
            .then(({ City, Country }) => ({ city: City, country: Country }))
            .catch(() => this.queryIPByAliyun(ip))
            .then(({ city, country }) => ({ city, country }))
            .catch(() => null);
    }
};
IPService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], IPService);
exports.IPService = IPService;
//# sourceMappingURL=helper.service.ip.js.map