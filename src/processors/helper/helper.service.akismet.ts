/**
 * @file Helper Akismet service
 * @module processor/helper/akismet.service
 * @author Surmon <https://github.com/surmon-china>
 */

import akismet from 'akismet-api'
import { Injectable } from '@nestjs/common'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import * as APP_CONFIG from '@app/app.config'
import logger from '@app/utils/logger'

export enum AkismetActionType {
  CheckSpam = 'checkSpam',
  SubmitSpam = 'submitSpam',
  SubmitHam = 'submitHam',
}

// https://github.com/chrisfosterelli/akismet-api/blob/master/docs/comments.md
export interface AkismetPayload {
  user_ip: string
  user_agent: string
  referrer: string
  permalink?: string
  comment_type?: 'comment' | 'reply'
  comment_author?: string
  comment_author_email?: string
  comment_author_url?: string
  comment_content?: string
}

@Injectable()
export class AkismetService {
  private client: akismet
  private clientIsValid = false

  constructor() {
    this.initClient()
    this.initVerify()
  }

  private initClient(): void {
    // https://github.com/chrisfosterelli/akismet-api
    this.client = akismet.client({
      key: APP_CONFIG.AKISMET.key,
      blog: APP_CONFIG.AKISMET.blog,
    })
  }

  private initVerify(): void {
    this.client
      .verifyKey()
      .then((valid) => (valid ? Promise.resolve(valid) : Promise.reject('Akismet Key 无效')))
      .then(() => {
        this.clientIsValid = true
        logger.info('[Akismet]', 'key 有效，已准备好工作！')
      })
      .catch((error) => {
        this.clientIsValid = false
        logger.error('[Akismet]', '验证失败！无法工作', getMessageFromNormalError(error))
      })
  }

  private makeInterceptor(handleType: AkismetActionType) {
    return (content: AkismetPayload): Promise<any> => {
      return new Promise((resolve, reject) => {
        // 确定验证失败的情况下才会拦截验证，未认证或验证通过都继续操作
        if (this.clientIsValid === false) {
          const message = [`[Akismet]`, `verifyKey 失败，放弃 ${handleType} 操作！`]
          logger.warn(...(message as [any]))
          return resolve(message.join(''))
        }

        logger.info(`[Akismet]`, `${handleType} 操作中...`, new Date())
        this.client[handleType](content)
          .then((result) => {
            // 如果是检查 spam 且检查结果为 true
            if (handleType === AkismetActionType.CheckSpam && result) {
              logger.warn(`[Akismet]`, `${handleType} 检测到 SPAM！`, new Date(), content)
              reject('SPAM!')
            } else {
              logger.info(`[Akismet]`, `${handleType} 操作成功！`)
              resolve(result)
            }
          })
          .catch((error) => {
            const message = [`[Akismet]`, `${handleType} 操作失败！`]
            logger.error(...(message as [any]), error)
            reject(message.join(''))
          })
      })
    }
  }

  public checkSpam(payload: AkismetPayload): Promise<any> {
    return this.makeInterceptor(AkismetActionType.CheckSpam)(payload)
  }

  public submitSpam(payload: AkismetPayload): Promise<any> {
    return this.makeInterceptor(AkismetActionType.SubmitSpam)(payload)
  }

  public submitHam(payload: AkismetPayload): Promise<any> {
    return this.makeInterceptor(AkismetActionType.SubmitHam)(payload)
  }
}
