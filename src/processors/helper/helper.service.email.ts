/**
 * @file Email service
 * @module processor/helper/email.service
 * @author Surmon <https://github.com/surmon-china>
 */

import nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import * as APP_CONFIG from '@app/app.config'
import logger from '@app/utils/logger'

const log = logger.scope('NodeMailer')

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
        pass: APP_CONFIG.EMAIL.password,
      },
    })
    this.verifyClient()
  }

  private verifyClient(): void {
    return this.transporter.verify((error) => {
      if (error) {
        this.clientIsValid = false
        setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30)
        log.error(`client init failed! retry when after 30 mins,`, getMessageFromNormalError(error))
      } else {
        this.clientIsValid = true
        log.info('client init succeed.')
      }
    })
  }

  public sendMail(mailOptions: EmailOptions) {
    if (!this.clientIsValid) {
      log.warn('send failed! (init failed)')
      return false
    }

    this.transporter.sendMail(
      {
        ...mailOptions,
        from: APP_CONFIG.EMAIL.from,
      },
      (error, info) => {
        if (error) {
          log.error(`send failed!`, getMessageFromNormalError(error))
        } else {
          log.info('send succeed.', info.messageId, info.response)
        }
      }
    )
  }

  public sendMailAs(prefix: string, mailOptions: EmailOptions) {
    return this.sendMail({
      ...mailOptions,
      subject: `[${prefix}] ${mailOptions.subject}`,
    })
  }
}
