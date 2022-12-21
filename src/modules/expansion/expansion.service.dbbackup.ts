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
import { EmailService } from '@app/processors/helper/helper.service.email'
import {
  UploadResult,
  AWSService,
  AWSStorageClass,
  AWSServerSideEncryption,
} from '@app/processors/helper/helper.service.aws'
import { APP, MONGO_DB, DB_BACKUP } from '@app/app.config'
import logger from '@app/utils/logger'

const log = logger.scope('ExpansionDBBackup')

const UP_FAILED_TIMEOUT = 1000 * 60 * 5
const UPLOAD_INTERVAL = '0 0 3 * * *'
const BACKUP_FILE_NAME = 'nodepress.zip'
const BACKUP_DIR_PATH = path.join(APP.ROOT_PATH, 'dbbackup')

@Injectable()
export class DBBackupService {
  constructor(private readonly emailService: EmailService, private readonly awsService: AWSService) {
    log.info('schedule job initialized.')
    schedule.scheduleJob(UPLOAD_INTERVAL, () => {
      this.backup().catch(() => {
        setTimeout(this.backup, UP_FAILED_TIMEOUT)
      })
    })
  }

  public async backup() {
    try {
      const result = await this.doBackup()
      const json = { ...result, size: (result.size / 1024).toFixed(2) + 'kb' }
      this.mailToAdmin('Database backup succeed', JSON.stringify(json, null, 2), true)
      return result
    } catch (error) {
      this.mailToAdmin('Database backup failed!', String(error))
      throw error
    }
  }

  private mailToAdmin(subject: string, content: string, isCode?: boolean) {
    this.emailService.sendMailAs(APP.NAME, {
      to: APP.ADMIN_EMAIL,
      subject,
      text: `${subject}, detail: ${content}`,
      html: `${subject} <br> ${isCode ? `<pre>${content}</pre>` : content}`,
    })
  }

  private doBackup() {
    return new Promise<UploadResult>((resolve, reject) => {
      if (!shell.which('mongodump')) {
        return reject('DB Backup script requires [mongodump]')
      }

      shell.cd(BACKUP_DIR_PATH)
      shell.rm('-rf', `./backup.prev`)
      shell.mv('./backup', './backup.prev')
      shell.mkdir('backup')

      // https://dba.stackexchange.com/questions/215534/mongodump-unrecognized-field-snapshot
      shell.exec(`mongodump --forceTableScan --uri="${MONGO_DB.uri}" --out="backup"`, (code, out) => {
        log.info('mongodump done.', code, out)
        if (code !== 0) {
          log.warn('mongodump failed!', out)
          return reject(out)
        }

        if (!shell.which('zip')) {
          return reject('DB Backup script requires [zip]')
        }

        // tar -czf - backup | openssl des3 -salt -k <password> -out target.tar.gz
        // shell.exec(`tar -czf ${BACKUP_FILE_NAME} ./backup`)
        shell.exec(`zip -r -P ${DB_BACKUP.password} ${BACKUP_FILE_NAME} ./backup`)
        const fileDate = moment(new Date()).format('YYYY-MM-DD-HH:mm')
        const fileName = `nodepress-mongodb/backup-${fileDate}.zip`
        const filePath = path.join(BACKUP_DIR_PATH, BACKUP_FILE_NAME)
        log.info('uploading: ' + fileName)
        log.info('file source: ' + filePath)

        // upload to cloud storage
        this.awsService
          .uploadFile({
            name: fileName,
            file: fs.createReadStream(filePath),
            fileContentType: 'application/zip',
            region: DB_BACKUP.s3Region,
            bucket: DB_BACKUP.s3Bucket,
            classType: AWSStorageClass.GLACIER,
            encryption: AWSServerSideEncryption.AES256,
          })
          .then((result) => {
            log.info('upload succeed.', result.url)
            resolve(result)
          })
          .catch((error) => {
            log.warn('upload failed!', error)
            reject(JSON.stringify(error.message))
          })
      })
    })
  }
}
