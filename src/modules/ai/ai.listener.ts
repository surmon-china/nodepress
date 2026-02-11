/**
 * @file AI event listeners
 * @module module/ai/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventKeys } from '@app/constants/events.constant'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import { ROOT_COMMENT_PID } from '@app/constants/biz.constant'
import { CommentAiGenerationExtraKeys, CommentDisqusExtraKeys } from '@app/constants/extras.constant'
import { DisqusPublicService } from '@app/modules/disqus/disqus.service.public'
import { Comment, CommentBaseWithExtras } from '@app/modules/comment/comment.model'
import { CommentStatus } from '@app/modules/comment/comment.constant'
import { getExtraValue } from '@app/transformers/extra.transformer'
import { APP_BIZ, DISQUS } from '@app/app.config'
import { AiService, logger } from './ai.service'

@Injectable()
export class AiListener {
  constructor(
    private readonly aiService: AiService,
    private readonly disqusPublicService: DisqusPublicService
  ) {}

  @OnEvent(EventKeys.CommentCreated, { async: true })
  async handleCommentCreated(comment: Comment) {
    // 1. Only respond to top-level comments (no parent comment)
    if (comment.pid !== ROOT_COMMENT_PID) return
    // 2. Only respond to publicly published comments
    if (comment.status !== CommentStatus.Published) return
    // 3. Minimum length requirement: at least 5 characters (excluding whitespace)
    if (comment.content.trim().length < 5) return
    // 4. Prevent loops: Do not respond to comments already marked as AI-generated
    if (getExtraValue(comment.extras, CommentAiGenerationExtraKeys.Flag)) return
    // 5. Do not respond to comments made by the administrator
    const disqusAuthorName = getExtraValue(comment.extras, CommentDisqusExtraKeys.AuthorUsername)
    if (disqusAuthorName && disqusAuthorName === DISQUS.adminUsername) return

    try {
      // Generate AI response content
      const aiResult = await this.aiService.generateCommentReply(comment)

      // Construct AI comment object with metadata
      const aiComment: CommentBaseWithExtras = {
        post_id: comment.post_id,
        pid: comment.id!,
        content: aiResult.content,
        author: {
          name: APP_BIZ.NAME,
          email: APP_BIZ.ADMIN_EMAIL
        } as any,
        extras: [
          { key: CommentAiGenerationExtraKeys.Flag, value: 'true' },
          { key: CommentAiGenerationExtraKeys.Model, value: aiResult.model },
          { key: CommentAiGenerationExtraKeys.Provider, value: aiResult.provider }
        ]
      }

      // Initialize a clean visitor context for the AI
      const aiVisitor: QueryVisitor = {
        ip: null,
        ua: undefined,
        origin: undefined,
        referer: undefined
      }

      // Create the comment through the universal service (DB + Third-party sync)
      const newComment = await this.disqusPublicService.createUniversalComment(aiComment, aiVisitor)
      logger.success('AI auto-reply comment succeeded.', newComment.id)
    } catch (error) {
      logger.error('AI auto-reply comment failed!', error)
    }
  }
}
