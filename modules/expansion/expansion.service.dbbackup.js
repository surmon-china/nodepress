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
const node_schedule_1 = __importDefault(require("node-schedule"));
const common_1 = require("@nestjs/common");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const helper_service_aws_1 = require("../../processors/helper/helper.service.aws");
const app_config_1 = require("../../app.config");
const logger_1 = __importDefault(require("../../utils/logger"));
const log = logger_1.default.scope('DBBackupService');
const UP_FAILED_TIMEOUT = 1000 * 60 * 5;
const UPLOAD_INTERVAL = '0 0 3 * * *';
const BACKUP_FILE_NAME = 'nodepress.zip';
const BACKUP_DIR_PATH = path_1.default.join(app_config_1.APP.ROOT_PATH, 'dbbackup');
let DBBackupService = class DBBackupService {
    constructor(emailService, awsService) {
        this.emailService = emailService;
        this.awsService = awsService;
        log.info('schedule job initialized.');
        node_schedule_1.default.scheduleJob(UPLOAD_INTERVAL, () => {
            this.backup().catch(() => {
                setTimeout(this.backup.bind(this), UP_FAILED_TIMEOUT);
            });
        });
    }
    async backup() {
        try {
            const result = await this.doBackup();
            const json = Object.assign(Object.assign({}, result), { size: (result.size / 1024).toFixed(2) + 'kb' });
            this.mailToAdmin('Database backup succeed', JSON.stringify(json, null, 2), true);
            return result;
        }
        catch (error) {
            this.mailToAdmin('Database backup failed!', String(error));
            throw error;
        }
    }
    mailToAdmin(subject, content, isCode) {
        this.emailService.sendMailAs(app_config_1.APP.NAME, {
            to: app_config_1.APP.ADMIN_EMAIL,
            subject,
            text: `${subject}, detail: ${content}`,
            html: `${subject} <br> ${isCode ? `<pre>${content}</pre>` : content}`
        });
    }
    doBackup() {
        return new Promise((resolve, reject) => {
            if (!shelljs_1.default.which('mongodump')) {
                return reject('DB Backup script requires [mongodump]');
            }
            shelljs_1.default.cd(BACKUP_DIR_PATH);
            shelljs_1.default.rm('-rf', `./backup.prev`);
            shelljs_1.default.mv('./backup', './backup.prev');
            shelljs_1.default.mkdir('backup');
            shelljs_1.default.exec(`mongodump --forceTableScan --uri="${app_config_1.MONGO_DB.uri}" --out="backup"`, (code, out) => {
                log.info('mongodump done.', code, out);
                if (code !== 0) {
                    log.warn('mongodump failed!', out);
                    return reject(out);
                }
                if (!shelljs_1.default.which('zip')) {
                    return reject('DB Backup script requires [zip]');
                }
                shelljs_1.default.exec(`zip -r -P ${app_config_1.DB_BACKUP.password} ${BACKUP_FILE_NAME} ./backup`);
                const fileDate = (0, dayjs_1.default)(new Date()).format('YYYY-MM-DD-HH:mm');
                const fileName = `nodepress-mongodb/backup-${fileDate}.zip`;
                const filePath = path_1.default.join(BACKUP_DIR_PATH, BACKUP_FILE_NAME);
                log.info('uploading: ' + fileName);
                log.info('file source: ' + filePath);
                this.awsService
                    .uploadFile({
                    name: fileName,
                    file: fs_1.default.createReadStream(filePath),
                    fileContentType: 'application/zip',
                    region: app_config_1.DB_BACKUP.s3Region,
                    bucket: app_config_1.DB_BACKUP.s3Bucket,
                    classType: helper_service_aws_1.AWSStorageClass.GLACIER,
                    encryption: helper_service_aws_1.AWSServerSideEncryption.AES256
                })
                    .then((result) => {
                    log.info('upload succeed.', result.url);
                    resolve(result);
                })
                    .catch((error) => {
                    log.warn('upload failed!', error);
                    reject(JSON.stringify(error.message));
                });
            });
        });
    }
};
exports.DBBackupService = DBBackupService;
exports.DBBackupService = DBBackupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService,
        helper_service_aws_1.AWSService])
], DBBackupService);
//# sourceMappingURL=expansion.service.dbbackup.js.map