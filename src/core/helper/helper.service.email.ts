/**
 * @file Email service
 * @module core/helper/email.service
 * @author Surmon <https://github.com/surmon-china>
 */

import nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'EmailService', time: isDevEnv })

export interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter
  private clientIsValid: boolean

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: APP_CONFIG.EMAIL.host,
      port: APP_CONFIG.EMAIL.port,
      secure: false,
      auth: {
        user: APP_CONFIG.EMAIL.account,
        pass: APP_CONFIG.EMAIL.password
      }
    })
    this.verifyClient()
  }

  private verifyClient(): void {
    return this.transporter.verify((error) => {
      if (error) {
        this.clientIsValid = false
        setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30)
        logger.error(`client initialization failed! retry after 30 mins`, '|', getMessageFromNormalError(error))
      } else {
        this.clientIsValid = true
        logger.success('client initialized.')
      }
    })
  }

  public sendMail(mailOptions: EmailOptions) {
    if (!this.clientIsValid) {
      logger.warn('send failed! (initialization failed)')
      return false
    }

    this.transporter.sendMail(
      {
        ...mailOptions,
        from: APP_CONFIG.EMAIL.from
      },
      (error, info) => {
        if (error) {
          logger.failure(`send failed!`, getMessageFromNormalError(error))
        } else {
          logger.success('send succeeded.', info.messageId, info.response)
        }
      }
    )
  }

  public sendMailAs(prefix: string, mailOptions: EmailOptions) {
    return this.sendMail({
      ...mailOptions,
      subject: `[${prefix}] ${mailOptions.subject}`
    })
  }
}
