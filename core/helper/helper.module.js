"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const helper_service_google_1 = require("./helper.service.google");
const helper_service_akismet_1 = require("./helper.service.akismet");
const helper_service_s3_1 = require("./helper.service.s3");
const helper_service_email_1 = require("./helper.service.email");
const helper_service_seo_1 = require("./helper.service.seo");
const helper_service_ip_1 = require("./helper.service.ip");
const services = [helper_service_google_1.GoogleService, helper_service_akismet_1.AkismetService, helper_service_s3_1.S3Service, helper_service_email_1.EmailService, helper_service_seo_1.SeoService, helper_service_ip_1.IPService];
let HelperModule = class HelperModule {
};
exports.HelperModule = HelperModule;
exports.HelperModule = HelperModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        providers: services,
        exports: services
    })
], HelperModule);
//# sourceMappingURL=helper.module.js.map