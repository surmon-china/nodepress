/**
 * @file Comment service
 * @module module/comment/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { MongooseModel, WithId } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { InjectModel } from '@app/transformers/model.transformer'
import { EventKeys } from '@app/constants/events.constant'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import { IPService } from '@app/core/helper/helper.service.ip'
import { KeyValueModel } from '@app/models/key-value.model'
import { ArticleService } from '@app/modules/article/article.service'
import { User, UserPublic, USER_PUBLIC_POPULATE_SELECT } from '@app/modules/user/user.model'
import { CommentStatus, CommentTargetType, CommentAuthorType } from './comment.constant'
import { Comment, CommentDoc, CommentDocWith, NormalizedComment } from './comment.model'
import { CreateCommentDto, UpdateCommentDto } from './comment.dto'
import { CommentBlocklistService } from './comment.service.blocklist'
import { CommentAkismetService } from './comment.service.akismet'
import { CommentEffectService } from './comment.service.effect'
import { isDevEnv, isProdEnv } from '@app/app.environment'
import { createLogger } from '@app/utils/logger'

const logger = createLogger({ scope: 'CommentService', time: isDevEnv })

@Injectable()
export class CommentService {
  constructor(
    private readonly ipService: IPService,
    private readonly eventEmitter: EventEmitter2,
    private readonly articleService: ArticleService,
    private readonly akismetService: CommentAkismetService,
    private readonly blocklistService: CommentBlocklistService,
    private readonly effectService: CommentEffectService,
    @InjectModel(Comment) private readonly commentModel: MongooseModel<Comment>
  ) {}

  // normalize input data
  public normalize(
    input: CreateCommentDto,
    context: {
      visitor: QueryVisitor
      extras?: KeyValueModel[]
      user?: WithId<User>
    }
  ): NormalizedComment {
    const { visitor, extras, user } = context
    return {
      ...input,
      parent_id: input.parent_id ?? null,
      status: CommentStatus.Published,
      user: user?._id ?? null,
      author_type: user?._id ? CommentAuthorType.User : CommentAuthorType.Guest,
      author_name: user?.name ?? input.author_name,
      author_email: user?.email ?? input.author_email ?? null,
      author_website: user?.website ?? input.author_website ?? null,
      likes: 0,
      dislikes: 0,
      ip: visitor.ip,
      ip_location: null,
      user_agent: visitor.agent,
      extras: extras ?? []
    }
  }

  // create comment & trigger effects
  public async create(input: NormalizedComment): Promise<CommentDocWith<UserPublic>> {
    const ip_location = isProdEnv && input.ip ? await this.ipService.queryLocation(input.ip) : null
    const created = await this.commentModel.create({ ...input, ip_location })
    // populate user data for response
    const populated = await created.populate<{ user: UserPublic | null }>('user', USER_PUBLIC_POPULATE_SELECT)
    // effect: sync target (article / page) effects
    this.effectService.syncTargetEffects([populated])
    // event: dispatch created event (for emails, notifications, etc.)
    this.eventEmitter.emit(EventKeys.CommentCreated, populated.toObject())
    return populated
  }

  // validate & create comment
  public async validateAndCreate(input: NormalizedComment, referer?: string) {
    // 1. target validation (article only)
    if (input.target_type === CommentTargetType.Article) {
      if (!(await this.articleService.isCommentableArticle(input.target_id))) {
        throw new BadRequestException(`Comment is disabled for article: ${input.target_id}`)
      }
    }
    // 2. local blocklist & remote Akismet SPAM
    const [isSpam] = await Promise.all([
      this.akismetService.checkSpam(this.akismetService.transformCommentToAkismet(input, referer)),
      this.blocklistService.validate(input)
    ])
    if (isSpam) {
      throw new ForbiddenException('Comment blocked by Akismet SPAM.')
    }
    // 3. create in databse
    return this.create(input)
  }

  public async getDetail(commentId: number): Promise<CommentDoc>
  public async getDetail(commentId: number, populate: 'withUser'): Promise<CommentDocWith<User>>
  public async getDetail(commentId: number, populate: 'withUserPublic'): Promise<CommentDocWith<UserPublic>>
  public async getDetail(commentId: number, populate?: 'withUser' | 'withUserPublic') {
    const query = this.commentModel.findOne({ id: commentId })
    if (populate === 'withUser') {
      query.populate<{ user: User | null }>('user')
    } else if (populate === 'withUserPublic') {
      query.populate<{ user: UserPublic | null }>('user', USER_PUBLIC_POPULATE_SELECT)
    }
    const comment = await query.exec()
    if (!comment) throw new NotFoundException(`Comment '${commentId}' not found`)
    return comment as any
  }

  public paginate<T = Comment>(filter: QueryFilter<Comment>, options: PaginateOptions): Promise<PaginateResult<T>> {
    return this.commentModel.paginateRaw<T>(filter, { ...options, lean: { virtuals: true } })
  }

  public async getPublicCommentIdSet(commentIds: number[]): Promise<Set<number>> {
    if (!commentIds.length) return new Set()
    const found = await this.commentModel
      .find({ id: { $in: commentIds }, status: CommentStatus.Published })
      .select('id')
      .lean()
      .exec()
    return new Set(found.map(({ id }) => id))
  }

  public async update(commentId: number, input: UpdateCommentDto): Promise<CommentDoc> {
    const updated = await this.commentModel
      .findOneAndUpdate({ id: commentId }, { $set: input }, { returnDocument: 'after' })
      .exec()
    if (!updated) throw new NotFoundException(`Comment '${commentId}' not found`)
    this.effectService.syncTargetEffects([updated])
    this.blocklistService.syncByStatus([updated], updated.status)
    return updated
  }

  public async delete(commentId: number): Promise<CommentDoc> {
    const deleted = await this.commentModel.findOneAndDelete({ id: commentId }).exec()
    if (!deleted) throw new NotFoundException(`Comment '${commentId}' not found`)
    this.effectService.syncTargetEffects([deleted])
    return deleted
  }

  public async batchUpdateStatus(commentIds: number[], status: CommentStatus) {
    const comments = await this.commentModel
      .find({ id: { $in: commentIds } })
      .lean()
      .exec()
    const result = await this.commentModel.updateMany({ id: { $in: commentIds } }, { $set: { status } }).exec()
    this.blocklistService.syncByStatus(comments, status)
    this.effectService.syncTargetEffects(comments)
    return result
  }

  public async batchDelete(commentIds: number[]) {
    const targets = await this.commentModel
      .find({ id: { $in: commentIds } })
      .lean()
      .exec()
    const result = await this.commentModel.deleteMany({ id: { $in: commentIds } }).exec()
    this.effectService.syncTargetEffects(targets)
    return result
  }

  public async incrementVote(commentId: number, field: 'likes' | 'dislikes'): Promise<number> {
    const updated = await this.commentModel
      .findOneAndUpdate({ id: commentId }, { $inc: { [field]: 1 } }, { returnDocument: 'after', timestamps: false })
      .lean()
      .exec()
    if (!updated) throw new NotFoundException(`Comment '${commentId}' not found`)

    return updated[field]
  }
}
