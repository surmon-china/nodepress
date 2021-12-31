/**
 * @file Expansion DB backup service
 * @module module/expansion/dbbackup.service
 * @author Surmon <https://github.com/surmon-china>
 */

import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import moment from 'moment'
import schedule from 'node-schedule'
import { Injectable } from '@nestjs/common'
import { CloudStorageService } from '@app/processors/helper/helper.service.cs'
import logger from '@app/utils/logger'
import * as APP_CONFIG from '@app/app.config'

const UP_FAILED_TIMEOUT = 1000 * 60 * 5
const UPLOAD_INTERVAL = '0 0 3 * * *'
const BACKUP_FILE_NAME = 'nodepress.tar.gz'
const BACKUP_DIR_PATH = path.join(APP_CONFIG.APP.ROOT_PATH, 'dbbackup')
const BACKUP_DATA_PATH = path.join(BACKUP_DIR_PATH, BACKUP_FILE_NAME)

const SHELL_DIR_PATH = path.join(APP_CONFIG.APP.ROOT_PATH, 'scripts')
const BACKUP_SHELL_PATH = path.normalize(path.join(SHELL_DIR_PATH, 'dbbackup.sh'))
// const RECOVER_SHELL_PATH = path.normalize(path.join(SHELL_DIR_PATH, 'dbrecover.sh'));

@Injectable()
export class DBBackupService {
  constructor(private readonly cloudStorageService: CloudStorageService) {
    logger.info('[expansion]', 'DB Backup 开始执行定时数据备份任务！')
    schedule.scheduleJob(UPLOAD_INTERVAL, () => {
      this.backup().catch(() => {
        setTimeout(this.backup, UP_FAILED_TIMEOUT)
      })
    })
  }

  // 打包备份并上传
  public backup(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(BACKUP_SHELL_PATH)) {
        return reject('DB Backup shell 脚本不存在')
      }

      shell.exec(`sh ${BACKUP_SHELL_PATH}`, (code, out) => {
        const fileDate = moment(new Date()).format('YYYY-MM-DD-HH:mm')
        const fileName = `nodepress-db-backup-${fileDate}.tar.gz`
        logger.info('[expansion]', 'DB Backup shell 执行完成！', code, out)
        logger.info('[expansion]', 'DB Backup 上传文件: ' + fileName)
        logger.info('[expansion]', 'DB Backup 文件源位置: ' + BACKUP_DATA_PATH)

        // 上传文件
        this.cloudStorageService
          .uploadFile(fileName, BACKUP_DATA_PATH, APP_CONFIG.DB_BACKUP.region, APP_CONFIG.DB_BACKUP.bucket)
          .then((result) => {
            logger.info('[expansion]', 'DB Backup succeed!', {
              name: result.name,
              url: result.url,
            })
            return resolve()
          })
          .catch((error) => {
            logger.warn('[expansion]', 'DB Backup failed!', error)
            reject(JSON.stringify(error.message))
          })
      })
    })
  }
}
