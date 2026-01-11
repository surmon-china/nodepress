/**
 * @file Extension DB backup service
 * @module module/extension/dbbackup.service
 * @author Surmon <https://github.com/surmon-china>
 */

import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import dayjs from 'dayjs'
import schedule from 'node-schedule'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { EmailService } from '@app/core/helper/helper.service.email'
import type { S3FileObject } from '@app/core/helper/helper.service.s3'
import { S3Service, AWSStorageClass, AWSServerSideEncryption } from '@app/core/helper/helper.service.s3'
import { APP_BIZ, MONGO_DB, DB_BACKUP } from '@app/app.config'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'

const logger = createLogger({ scope: 'DBBackupService', time: isDevEnv })

const UP_FAILED_TIMEOUT = 1000 * 60 * 5
const UPLOAD_INTERVAL = '0 0 3 * * *'
const BACKUP_FILE_NAME = 'nodepress.zip'
const BACKUP_DIR_PATH = path.join(APP_BIZ.ROOT_PATH, 'dbbackup')

@Injectable()
export class DBBackupService {
  constructor(
    private readonly emailService: EmailService,
    private readonly s3Service: S3Service
  ) {
    logger.info('schedule job initialized.')
    schedule.scheduleJob(UPLOAD_INTERVAL, () => {
      this.backup().catch(() => {
        setTimeout(this.backup.bind(this), UP_FAILED_TIMEOUT)
      })
    })
  }

  public async backup() {
    try {
      const result = await this.doBackup()
      const json = {
        ...result,
        lastModified: result.lastModified?.toLocaleString('zh'),
        size: (result.size / 1024).toFixed(2) + 'kb'
      }
      this.mailToAdmin('Database backup succeeded', JSON.stringify(json, null, 2), true)
      return result
    } catch (error: unknown) {
      this.mailToAdmin('Database backup failed!', String(error))
      throw new InternalServerErrorException(String(error))
    }
  }

  private mailToAdmin(subject: string, content: string, isCode?: boolean) {
    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject,
      text: `${subject}, detail: ${content}`,
      html: `${subject} <br> ${isCode ? `<pre>${content}</pre>` : content}`
    })
  }

  private doBackup() {
    return new Promise<S3FileObject>((resolve, reject) => {
      if (!shell.which('mongodump')) {
        return reject('DB Backup script requires [mongodump]')
      }

      shell.cd(BACKUP_DIR_PATH)
      shell.rm('-rf', `./backup.prev`)
      shell.mv('./backup', './backup.prev')
      shell.mkdir('backup')

      // https://dba.stackexchange.com/questions/215534/mongodump-unrecognized-field-snapshot
      // https://www.mongodb.com/docs/database-tools/mongodump/#std-option-mongodump.--quiet
      shell.exec(`mongodump --quiet --forceTableScan --uri="${MONGO_DB.uri}" --out="backup"`, (code, out, err) => {
        if (code === 0) {
          const filesCount = shell.ls('./backup/*')
          logger.log('mongodump succeeded.', `${filesCount.length} files`)
        } else {
          logger.failure('mongodump failed!', out, err)
          return reject(out)
        }

        if (!shell.which('zip')) {
          return reject('DB Backup script requires [zip]')
        }

        // tar -czf - backup | openssl des3 -salt -k <password> -out target.tar.gz
        // shell.exec(`tar -czf ${BACKUP_FILE_NAME} ./backup`)
        shell.exec(`zip -q -r -P ${DB_BACKUP.password} ${BACKUP_FILE_NAME} ./backup`)
        const fileDate = dayjs(new Date()).format('YYYY-MM-DD-HH:mm')
        const fileName = `nodepress-mongodb/backup-${fileDate}.zip`
        const filePath = path.join(BACKUP_DIR_PATH, BACKUP_FILE_NAME)
        logger.log(`uploading: ${fileName}`)
        logger.log(`file source: ${filePath}`)

        // Upload to cloud storage
        this.s3Service
          .uploadFile({
            key: fileName,
            file: fs.createReadStream(filePath),
            fileContentType: 'application/zip',
            region: DB_BACKUP.s3Region,
            bucket: DB_BACKUP.s3Bucket,
            classType: AWSStorageClass.STANDARD_IA,
            encryption: AWSServerSideEncryption.AES256
          })
          .then((result) => {
            logger.success('upload succeeded.', result.key)
            resolve(result)
          })
          .catch((error) => {
            const errorMessage = JSON.stringify(error.message ?? error)
            logger.failure('upload failed!', errorMessage)
            reject(errorMessage)
          })
      })
    })
  }
}
