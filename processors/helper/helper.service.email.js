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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const common_1 = require("@nestjs/common");
const error_transformer_1 = require("../../transformers/error.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger = (0, logger_1.createLogger)({ scope: 'EmailService', time: app_environment_1.isDevEnv });
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: APP_CONFIG.EMAIL.host,
            port: APP_CONFIG.EMAIL.port,
            secure: false,
            auth: {
                user: APP_CONFIG.EMAIL.account,
                pass: APP_CONFIG.EMAIL.password
            }
        });
        this.verifyClient();
    }
    verifyClient() {
        return this.transporter.verify((error) => {
            if (error) {
                this.clientIsValid = false;
                setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30);
                logger.error(`client init failed! retry after 30 mins`, '|', (0, error_transformer_1.getMessageFromNormalError)(error));
            }
            else {
                this.clientIsValid = true;
                logger.success('client init succeed.');
            }
        });
    }
    sendMail(mailOptions) {
        if (!this.clientIsValid) {
            logger.warn('send failed! (init failed)');
            return false;
        }
        this.transporter.sendMail(Object.assign(Object.assign({}, mailOptions), { from: APP_CONFIG.EMAIL.from }), (error, info) => {
            if (error) {
                logger.failure(`send failed!`, (0, error_transformer_1.getMessageFromNormalError)(error));
            }
            else {
                logger.success('send succeed.', info.messageId, info.response);
            }
        });
    }
    sendMailAs(prefix, mailOptions) {
        return this.sendMail(Object.assign(Object.assign({}, mailOptions), { subject: `[${prefix}] ${mailOptions.subject}` }));
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=helper.service.email.js.map