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
exports.DBBackupService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const dayjs_1 = __importDefault(require("dayjs"));
const schedule_1 = require("@nestjs/schedule");
const common_1 = require("@nestjs/common");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const helper_service_s3_1 = require("../../core/helper/helper.service.s3");
const app_config_1 = require("../../app.config");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const logger = (0, logger_1.createLogger)({ scope: 'DBBackupService', time: app_environment_1.isDevEnv });
const BACKUP_DIR_PATH = path_1.default.join(app_config_1.APP_BIZ.ROOT_PATH, 'dbbackup');
let DBBackupService = class DBBackupService {
    emailService;
    s3Service;
    constructor(emailService, s3Service) {
        this.emailService = emailService;
        this.s3Service = s3Service;
    }
    dailyDatabseBackup() {
        this.backup().catch((error) => {
            logger.failure('DailyDatabaseBackupJob failed!', error);
        });
    }
    async backup() {
        try {
            const result = await this.doBackup();
            const json = {
                ...result,
                lastModified: result.lastModified?.toLocaleString('zh'),
                size: (result.size / 1024).toFixed(2) + 'kb'
            };
            this.mailToAdmin('Database backup succeeded', JSON.stringify(json, null, 2), true);
            return result;
        }
        catch (error) {
            this.mailToAdmin('Database backup failed!', String(error));
            throw new common_1.InternalServerErrorException(String(error));
        }
    }
    mailToAdmin(subject, content, isCode) {
        this.emailService.sendMailAs(app_config_1.APP_BIZ.NAME, {
            to: app_config_1.APP_BIZ.ADMIN_EMAIL,
            subject,
            text: `${subject}, detail: ${content}`,
            html: `${subject} <br> ${isCode ? `<pre>${content}</pre>` : content}`
        });
    }
    async doBackup() {
        const dependencies = ['mongodump', 'zip'];
        for (const dep of dependencies) {
            if (!shelljs_1.default.which(dep))
                throw new Error(`missing dependency: [${dep}]`);
        }
        const backupPath = path_1.default.join(BACKUP_DIR_PATH, 'backup');
        const backupPrevPath = path_1.default.join(BACKUP_DIR_PATH, 'backup.prev');
        shelljs_1.default.rm('-rf', backupPrevPath);
        shelljs_1.default.test('-d', backupPath) && shelljs_1.default.mv(backupPath, backupPrevPath);
        shelljs_1.default.mkdir('-p', backupPath);
        const dumpCmd = `mongodump --quiet --forceTableScan --uri="${app_config_1.MONGO_DB.uri}" --out="${backupPath}"`;
        const dumpResult = shelljs_1.default.exec(dumpCmd);
        if (dumpResult.code !== 0)
            throw new Error(`mongodump failed: ${dumpResult.stderr}`);
        logger.log('mongodump succeeded:', `${shelljs_1.default.ls(`${backupPath}/*`).length} files`);
        const backupFolderName = path_1.default.basename(backupPath);
        const parentFolderPath = path_1.default.dirname(backupPath);
        const zipPath = path_1.default.join(BACKUP_DIR_PATH, 'nodepress.zip');
        const zipCmd = `zip -q -r -P ${app_config_1.DB_BACKUP.password} "${zipPath}" "${backupFolderName}"`;
        const zipResult = shelljs_1.default.exec(zipCmd, { cwd: parentFolderPath });
        if (zipResult.code !== 0)
            throw new Error(`zip failed: ${zipResult.stderr}`);
        const fileDate = (0, dayjs_1.default)(new Date()).format('YYYY-MM-DD-HH-mm');
        const fileName = `nodepress-mongodb-backup_${fileDate}.zip`;
        logger.log(`file path: ${zipPath}`);
        logger.log(`file key: ${fileName}`);
        return this.s3Service
            .uploadFile({
            key: fileName,
            file: fs_1.default.createReadStream(zipPath),
            fileContentType: 'application/zip',
            region: app_config_1.DB_BACKUP.s3Region,
            bucket: app_config_1.DB_BACKUP.s3Bucket,
            encryption: helper_service_s3_1.S3ServerSideEncryption.AES256
        })
            .then((result) => {
            logger.success('upload succeeded:', result.key);
            return result;
        })
            .catch((error) => {
            const errorMessage = String(error.message ?? error);
            logger.failure('upload failed!', errorMessage);
            throw errorMessage;
        });
    }
};
exports.DBBackupService = DBBackupService;
__decorate([
    (0, schedule_1.Cron)('0 0 3 * * *', { name: 'DailyDatabaseBackupJob' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DBBackupService.prototype, "dailyDatabseBackup", null);
exports.DBBackupService = DBBackupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService,
        helper_service_s3_1.S3Service])
], DBBackupService);
//# sourceMappingURL=system.service.dbbackup.js.map