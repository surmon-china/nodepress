/**
 * @file Comment Akismet service
 * @module module/comment/service.akismet
 * @author Surmon <https://github.com/surmon-china>
 */

import { AkismetClient } from 'akismet-api'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { getPermalink } from '@app/transformers/urlmap.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { AKISMET } from '@app/app.config'
import { NormalizedComment } from './comment.model'

const logger = createLogger({ scope: 'CommentAkismetService', time: isDevEnv })

// https://github.com/chrisfosterelli/akismet-api/blob/main/docs/comments.md
export interface AkismetPayload {
  user_ip: string
  user_agent: string
  referrer: string
  permalink?: string
  comment_type?: 'comment' | 'reply' | 'forum-post' | 'blog-post'
  comment_content?: string
  comment_author?: string
  comment_author_email?: string
  comment_author_url?: string
  comment_date_gmt?: string
}

@Injectable()
export class CommentAkismetService implements OnModuleInit {
  private client: AkismetClient
  private isAvailable = false

  constructor() {
    // https://github.com/chrisfosterelli/akismet-api
    this.client = new AkismetClient({
      key: AKISMET.apiKey,
      blog: AKISMET.blog
    })
  }

  async onModuleInit() {
    try {
      this.isAvailable = await this.client.verifyKey()
      if (this.isAvailable) {
        logger.success('Client initialized.')
      } else {
        logger.failure('Invalid Akismet key, service unavailable.')
      }
    } catch (error) {
      this.isAvailable = false
      logger.failure('Initialization failed!', error)
    }
  }

  public async checkSpam(payload: AkismetPayload): Promise<boolean> {
    if (!this.isAvailable) {
      logger.warn('checkSpam skipped: Akismet service unavailable.')
      return false
    }

    try {
      return await this.client.checkSpam(payload)
    } catch (error) {
      logger.error('checkSpam failed, default to HAM (Fail-open).', error)
      return false
    }
  }

  public async submitSpam(payload: AkismetPayload): Promise<void> {
    if (this.isAvailable) {
      try {
        await this.client.submitSpam(payload)
        logger.info('Spam reported!')
      } catch (error) {
        logger.error('submitSpam failed!', error)
      }
    }
  }

  public async submitHam(payload: AkismetPayload): Promise<void> {
    if (this.isAvailable) {
      try {
        await this.client.submitHam(payload)
        logger.info('Non-spam reported!')
      } catch (error) {
        logger.error('submitHam failed!', error)
      }
    }
  }

  public transformCommentToAkismet(comment: NormalizedComment, referer?: string): AkismetPayload {
    return {
      user_ip: comment.ip!,
      user_agent: comment.user_agent!,
      referrer: referer || '',
      permalink: getPermalink(comment.target_type, comment.target_id),
      comment_type: comment.parent_id ? 'reply' : 'comment',
      comment_author: comment.author_name,
      comment_author_email: comment.author_email ?? void 0,
      comment_author_url: comment.author_website ?? void 0,
      comment_content: comment.content
    }
  }
}
