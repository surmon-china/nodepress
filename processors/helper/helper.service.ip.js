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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const error_transformer_1 = require("../../transformers/error.transformer");
const logger_1 = __importDefault(require("../../utils/logger"));
const log = logger_1.default.scope('IPService');
let IPService = exports.IPService = class IPService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    queryLocationByIP_API(ip) {
        return this.httpService.axiosRef
            .get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip`)
            .then((response) => {
            var _a;
            return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.status) !== 'success'
                ? Promise.reject(response.data.message)
                : Promise.resolve({
                    country: response.data.country,
                    country_code: response.data.countryCode,
                    region: response.data.regionName,
                    region_code: response.data.region,
                    city: response.data.city,
                    zip: response.data.zip
                });
        })
            .catch((error) => {
            const message = (0, error_transformer_1.getMessageFromAxiosError)(error);
            log.warn('queryLocationByIPAPI failed!', message);
            return Promise.reject(message);
        });
    }
    queryLocationByAPICo(ip) {
        return this.httpService.axiosRef
            .get(`https://ipapi.co/${ip}/json/`)
            .then((response) => {
            var _a;
            return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.error)
                ? Promise.reject(response.data.reason)
                : Promise.resolve({
                    country: response.data.country_name,
                    country_code: response.data.country_code,
                    region: response.data.region,
                    region_code: response.data.region_code,
                    city: response.data.city,
                    zip: response.data.postal
                });
        })
            .catch((error) => {
            const message = (0, error_transformer_1.getMessageFromAxiosError)(error);
            log.warn('queryLocationByAPICo failed!', message);
            return Promise.reject(message);
        });
    }
    queryLocation(ip) {
        return this.queryLocationByIP_API(ip)
            .catch(() => this.queryLocationByAPICo(ip))
            .catch(() => null);
    }
};
exports.IPService = IPService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], IPService);
//# sourceMappingURL=helper.service.ip.js.map