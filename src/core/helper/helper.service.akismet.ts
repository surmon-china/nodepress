/**
 * @file Akismet service
 * @module core/helper/akismet.service
 * @author Surmon <https://github.com/surmon-china>
 */

import { AkismetClient } from 'akismet-api'
import { Injectable } from '@nestjs/common'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'AkismetService', time: isDevEnv })

// keyof typeof AkismetClient
export enum AkismetAction {
  CheckSpam = 'checkSpam',
  SubmitSpam = 'submitSpam',
  SubmitHam = 'submitHam'
}

// https://github.com/chrisfosterelli/akismet-api/blob/master/docs/comments.md
export interface AkismetPayload {
  user_ip: string
  user_agent: string
  referrer: string
  permalink?: string | null
  comment_type?: 'comment' | 'reply'
  comment_author?: string | null
  comment_author_email?: string | null
  comment_author_url?: string | null
  comment_content?: string | null
}

@Injectable()
export class AkismetService {
  private client: AkismetClient
  private clientIsValid = false

  constructor() {
    this.initClient()
    this.initVerify()
  }

  private initClient(): void {
    // https://github.com/chrisfosterelli/akismet-api
    this.client = new AkismetClient({
      key: APP_CONFIG.AKISMET.key as string,
      blog: APP_CONFIG.AKISMET.blog as string
    })
  }

  private initVerify(): void {
    this.client
      .verifyKey()
      .then((valid) => (valid ? Promise.resolve(valid) : Promise.reject('Invalid Akismet key')))
      .then(() => {
        this.clientIsValid = true
        logger.success('client initialized.')
      })
      .catch((error) => {
        this.clientIsValid = false
        logger.failure('client initialization failed!', '|', getMessageFromNormalError(error))
      })
  }

  private makeInterceptor(handleType: AkismetAction) {
    return (content: AkismetPayload): Promise<any> => {
      return new Promise((resolve, reject) => {
        // continue operation only when initialization successful
        if (!this.clientIsValid) {
          const message = `${handleType} failed! reason: init failed`
          logger.warn(message)
          return resolve(message)
        }

        logger.log(`${handleType}...`, new Date())
        this.client[handleType]({
          ...content,
          permalink: content.permalink || undefined,
          comment_author: content.comment_author || undefined,
          comment_author_email: content.comment_author_email || undefined,
          comment_author_url: content.comment_author_url || undefined,
          comment_content: content.comment_content || undefined
        })
          .then((result) => {
            if (handleType === AkismetAction.CheckSpam && result) {
              logger.info(`${handleType} found SPAM!`, new Date(), content)
              reject('SPAM!')
            } else {
              logger.info(`${handleType} succeeded.`)
              resolve(result)
            }
          })
          .catch((error) => {
            const message = `${handleType} failed!`
            logger.warn(message, error)
            reject(message)
          })
      })
    }
  }

  public checkSpam(payload: AkismetPayload): Promise<any> {
    return this.makeInterceptor(AkismetAction.CheckSpam)(payload)
  }

  public submitSpam(payload: AkismetPayload): Promise<any> {
    return this.makeInterceptor(AkismetAction.SubmitSpam)(payload)
  }

  public submitHam(payload: AkismetPayload): Promise<any> {
    return this.makeInterceptor(AkismetAction.SubmitHam)(payload)
  }
}
