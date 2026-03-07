/**
 * @file AI event listeners
 * @module module/ai/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GlobalEventKey } from '@app/constants/events.constant'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import { KeyValueModel } from '@app/models/key-value.model'
import { CommentAiGenerationExtraKey } from '@app/constants/extras.constant'
import { CommentWith } from '@app/modules/comment/comment.model'
import { CreateCommentDto } from '@app/modules/comment/comment.dto'
import { CommentService } from '@app/modules/comment/comment.service'
import { CommentStatus } from '@app/modules/comment/comment.constant'
import { UserType } from '@app/modules/user/user.constant'
import { UserPublic } from '@app/modules/user/user.model'
import { getExtraValue } from '@app/transformers/extra.transformer'
import { APP_BIZ } from '@app/app.config'
import { AiService, logger } from './ai.service'

@Injectable()
export class AiListener {
  constructor(
    private readonly aiService: AiService,
    private readonly commentService: CommentService
  ) {}

  @OnEvent(GlobalEventKey.CommentCreated, { async: true })
  async handleCommentCreated(comment: CommentWith<UserPublic>) {
    // 1. Only respond to top-level comments (no parent comment)
    if (comment.parent_id !== null) return
    // 2. Only respond to publicly published comments
    if (comment.status !== CommentStatus.Approved) return
    // 3. Minimum length requirement: at least 5 characters (excluding whitespace)
    if (comment.content.trim().length < 5) return
    // 4. Prevent loops: Do not respond to comments already marked as AI-generated
    if (getExtraValue(comment.extras, CommentAiGenerationExtraKey.Flag)) return
    // 5. Do not respond to comments made by the moderator
    // if (comment.user?.type === UserType.Moderator) return

    try {
      // Generate AI response content
      const aiResult = await this.aiService.generateCommentReply(comment)

      // Construct AI comment object with metadata
      const aiComment: CreateCommentDto = {
        target_type: comment.target_type,
        target_id: comment.target_id,
        parent_id: comment.id!,
        content: aiResult.content,
        author_name: APP_BIZ.AI_AUTHOR_NAME,
        author_email: APP_BIZ.AI_AUTHOR_EMAIL,
        author_website: null
      }

      const aiCommentExtras: KeyValueModel[] = [
        { key: CommentAiGenerationExtraKey.Flag, value: 'true' },
        { key: CommentAiGenerationExtraKey.Model, value: aiResult.model },
        { key: CommentAiGenerationExtraKey.Provider, value: aiResult.provider }
      ]

      // Initialize a clean visitor context for the AI
      const aiVisitor: QueryVisitor = {
        ip: null,
        agent: null,
        origin: null,
        referer: null
      }

      // Create the comment to DB
      const createdComment = await this.commentService.create(
        this.commentService.normalize(aiComment, {
          visitor: aiVisitor,
          extras: aiCommentExtras
        })
      )

      logger.success('AI auto-reply comment succeeded.', createdComment.id)
    } catch (error) {
      logger.error('AI auto-reply comment failed!', error)
    }
  }
}
