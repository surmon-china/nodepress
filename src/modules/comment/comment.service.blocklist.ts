/**
 * @file Comment blocklist service
 * @module module/comment/service.blocklist
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, ForbiddenException } from '@nestjs/common'
import { OptionsService } from '@app/modules/options/options.service'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { CommentStatus } from './comment.constant'
import { Comment } from './comment.model'

const logger = createLogger({ scope: 'CommentBlocklistService', time: isDevEnv })

@Injectable()
export class CommentBlocklistService {
  constructor(private readonly optionsService: OptionsService) {}

  /** Validate comment by NodePress block (IP / email / keywords) */
  public async validate(input: Pick<Comment, 'ip' | 'author_email' | 'content'>): Promise<void> {
    const { blocklist } = await this.optionsService.ensureOptions()
    const { keywords, emails, ips } = blocklist

    // validate IP
    if (ips.includes(input.ip!)) {
      throw new ForbiddenException(`Comment blocked by IP.`)
    }

    // validate email
    if (input.author_email && emails.includes(input.author_email)) {
      throw new ForbiddenException(`Comment blocked by Email.`)
    }

    // validate keywords
    const contentLower = input.content.toLowerCase()
    if (keywords.some((keyword) => contentLower.includes(keyword.toLowerCase()))) {
      throw new ForbiddenException('Comment blocked by Keywords.')
    }
  }

  /** Update NodePress blocklist (IP / email) by comment status */
  public async syncByStatus(
    inputList: Pick<Comment, 'ip' | 'author_email'>[],
    status: CommentStatus
  ): Promise<void> {
    const ips = [...new Set(inputList.map((c) => c.ip).filter(Boolean))] as string[]
    const emails = [...new Set(inputList.map((c) => c.author_email).filter(Boolean))] as string[]
    if (!ips.length && !emails.length) {
      return
    }

    // Only a SPAM status indicates being "added to the blacklist".
    // any other status change (such as passing review) is considered "removed from the blacklist".
    const blocklistAction =
      status === CommentStatus.Spam
        ? this.optionsService.appendToBlocklist({ ips, emails })
        : this.optionsService.removeFromBlocklist({ ips, emails })

    try {
      await blocklistAction
      logger.info('syncByStatus succeeded.', { ips, emails })
    } catch (error) {
      logger.warn('syncByStatus failed!', error)
    }
  }
}
