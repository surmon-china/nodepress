/**
 * Expansion DB backup service.
 * @file 数据库备份服务
 * @module module/expansion/dbbackup.service
 * @author Surmon <https://github.com/surmon-china>
 */

import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import moment from 'moment';
import schedule from 'node-schedule';
import { Injectable } from '@nestjs/common';
import { CloudStorageService } from '@app/processors/helper/helper.service.cs';
import * as APP_CONFIG from '@app/app.config';

// Configs
const UPFAILE_TIMEOUT = 1000 * 60 * 5;
const UPLOAD_INTERVAL = '0 0 3 * * *';

const BACKUP_FILE_EXT = '.tar.gz';
const BACKUP_SHELL_PATH = path.normalize(APP_CONFIG.DB_BACKUP.backupShellPath);
const BACKUP_DATA_PATH = path.resolve(APP_CONFIG.DB_BACKUP.backupFilePath, `nodepress${BACKUP_FILE_EXT}`);

@Injectable()
export class DBBackupcService {

  constructor(private readonly cloudStorageService: CloudStorageService) {
    console.log('DB Backup 开始执行定时数据备份任务！');
    schedule.scheduleJob(UPLOAD_INTERVAL, () => {
      this.backup().catch(() => {
        setTimeout(this.backup, UPFAILE_TIMEOUT);
      });
    });
  }

  // 打包备份并上传
  public backup(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(BACKUP_SHELL_PATH)) {
        return reject('DB Backup shell 脚本不存在');
      }

      shell.exec(`sh ${BACKUP_SHELL_PATH}`, (code, out) => {
        const fileDate = moment(new Date()).format('YYYY-MM-DD-HH:mm');
        const fileName = `nodepress-db-backup-${fileDate}${BACKUP_FILE_EXT}`;
        console.info('DB Backup shell 执行完成！', code, out);
        console.info('DB Backup 上传文件: ' + fileName);
        console.info('DB Backup 文件源位置: ' + BACKUP_DATA_PATH);

        // 上传文件
        this.cloudStorageService.uploadFile(
          fileName,
          BACKUP_DATA_PATH,
          APP_CONFIG.DB_BACKUP.region,
          APP_CONFIG.DB_BACKUP.bucket,
        )
        .then(result => {
          console.info('DB Backup 备份数据上传成功!', result);
          return resolve();
        })
        .catch(error => {
          console.warn('DB Backup 备份数据失败!', error);
          reject(JSON.stringify(error.message));
        });
      });
    });
  }
}
