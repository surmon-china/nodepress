/**
 * @file Vote controller
 * @module module/vote/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import type { QueryFilter } from 'mongoose'
import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common'
import { Throttle, minutes, seconds } from '@nestjs/throttler'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { resolveGeneralAuthor } from '@app/constants/author.constant'
import { ArticleStatsService } from '@app/modules/article/article.service.stats'
import { CommentService } from '@app/modules/comment/comment.service'
import { UserService } from '@app/modules/user/user.service'
import { IPService } from '@app/core/helper/helper.service.ip'
import { CommentVoteDto, ArticleVoteDto, VotePaginateQueryDto, VoteIdsDto } from './vote.dto'
import { VoteTargetType, VoteType } from './vote.constant'
import { Vote, VoteWithUser } from './vote.model'
import { VoteService } from './vote.service'

@Controller('votes')
export class VoteController {
  constructor(
    private readonly ipService: IPService,
    private readonly voteService: VoteService,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
    private readonly articleStatsService: ArticleStatsService
  ) {}

  @Post('/article')
  @Throttle({ default: { ttl: minutes(1), limit: 10 } })
  @SuccessResponse('Vote article succeeded')
  async votePost(
    @Body() dto: ArticleVoteDto,
    @RequestContext() { visitor, identity }: IRequestContext
  ): Promise<number> {
    const result = await this.articleStatsService.incrementStatistics(dto.article_id, 'likes')

    const [user, ipLocation] = await Promise.all([
      identity.isUser ? this.userService.findOne(identity.payload!.uid!) : null,
      visitor.ip ? this.ipService.queryLocation(visitor.ip) : null
    ])

    await this.voteService.create({
      target_type: VoteTargetType.Article,
      target_id: dto.article_id,
      vote_type: dto.vote,
      ...resolveGeneralAuthor(dto, user),
      user_agent: visitor.agent,
      ip: visitor.ip,
      ip_location: ipLocation
    })

    return result
  }

  @Post('/comment')
  @Throttle({ default: { ttl: seconds(30), limit: 10 } })
  @SuccessResponse('Vote comment succeeded')
  async voteComment(
    @Body() dto: CommentVoteDto,
    @RequestContext() { visitor, identity }: IRequestContext
  ): Promise<number> {
    const result = await this.commentService.incrementVote(
      dto.comment_id,
      dto.vote === VoteType.Upvote ? 'likes' : 'dislikes'
    )

    const [user, ipLocation] = await Promise.all([
      identity.isUser ? this.userService.findOne(identity.payload!.uid!) : null,
      visitor.ip ? this.ipService.queryLocation(visitor.ip) : null
    ])

    await this.voteService.create({
      target_type: VoteTargetType.Comment,
      target_id: dto.comment_id,
      vote_type: dto.vote,
      ...resolveGeneralAuthor(dto, user),
      user_agent: visitor.agent,
      ip: visitor.ip,
      ip_location: ipLocation
    })

    return result
  }

  @Get()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse({ message: 'Get votes succeeded', usePaginate: true })
  getVotes(@Query() query: VotePaginateQueryDto): Promise<PaginateResult<VoteWithUser>> {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<Vote> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }

    // target type
    if (!_isUndefined(filters.target_type)) {
      queryFilter.target_type = filters.target_type
    }
    // target ID
    if (!_isUndefined(filters.target_id)) {
      queryFilter.target_id = filters.target_id
    }
    // vote type
    if (!_isUndefined(filters.vote_type)) {
      queryFilter.vote_type = filters.vote_type
    }
    // author type
    if (!_isUndefined(filters.author_type)) {
      queryFilter.author_type = filters.author_type
    }

    return this.voteService.paginate<VoteWithUser>(queryFilter, {
      ...paginateOptions,
      populate: 'user'
    })
  }

  @Delete()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete votes succeeded')
  deleteVotes(@Body() { vote_ids }: VoteIdsDto) {
    return this.voteService.batchDelete(vote_ids)
  }
}
