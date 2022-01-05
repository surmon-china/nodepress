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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const common_1 = require("@nestjs/common");
const error_transformer_1 = require("../../transformers/error.transformer");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger_1 = __importDefault(require("../../utils/logger"));
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: 'smtp.qq.com',
            secure: true,
            port: 465,
            auth: {
                user: APP_CONFIG.EMAIL.account,
                pass: APP_CONFIG.EMAIL.password,
            },
        });
        this.verifyClient();
    }
    verifyClient() {
        return this.transporter.verify((error) => {
            if (error) {
                this.clientIsValid = false;
                setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30);
                logger_1.default.error(`[NodeMailer]`, `客户端初始化连接失败！将在半小时后重试`, (0, error_transformer_1.getMessageFromNormalError)(error));
            }
            else {
                this.clientIsValid = true;
                logger_1.default.info('[NodeMailer]', '客户端初始化连接成功！随时可发送邮件');
            }
        });
    }
    sendMail(mailOptions) {
        if (!this.clientIsValid) {
            logger_1.default.warn('[NodeMailer]', '由于未初始化成功，邮件客户端发送被拒绝！');
            return false;
        }
        const options = Object.assign(Object.assign({}, mailOptions), { from: APP_CONFIG.EMAIL.from });
        this.transporter.sendMail(options, (error, info) => {
            if (error) {
                logger_1.default.error(`[NodeMailer]`, `邮件发送失败`, (0, error_transformer_1.getMessageFromNormalError)(error));
            }
            else {
                logger_1.default.info('[NodeMailer]', '邮件发送成功', info.messageId, info.response);
            }
        });
    }
    sendMailAs(prefix, mailOptions) {
        return this.sendMail(Object.assign(Object.assign({}, mailOptions), { subject: `[${prefix}] ${mailOptions.subject}` }));
    }
};
EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=helper.service.email.js.map