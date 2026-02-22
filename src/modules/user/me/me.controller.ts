/**
 * @file User Me controller
 * @module module/user/me/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Throttle, hours } from '@nestjs/throttler'
import { Controller, Get, Post, Patch, Delete, Body } from '@nestjs/common'
import { EmailService } from '@app/core/helper/helper.service.email'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { linesToEmailContent } from '@app/transformers/email.transformer'
import { Comment } from '@app/modules/comment/comment.model'
import { Vote } from '@app/modules/vote/vote.model'
import { APP_BIZ } from '@app/app.config'
import { UserService } from '../user.service'
import { UserAccountService } from './me.service.account'
import { UserActivityService } from './me.service.activity'
import { UpdateProfileDto, RemoveIdentityDto, DestroyAccountDto } from './me.dto'
import { DeleteCommentDto } from './me.dto'

@Controller('user/me')
@OnlyIdentity(IdentityRole.User)
export class UserMeController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly userAccountService: UserAccountService,
    private readonly userActivityService: UserActivityService
  ) {}

  @Get('profile')
  @SuccessResponse('Get profile succeeded')
  getProfile(@RequestContext() { identity }: IRequestContext) {
    return this.userService.findOne(identity.payload!.uid!)
  }

  @Patch('profile')
  @SuccessResponse('Update profile succeeded')
  updateProfile(@RequestContext() { identity }: IRequestContext, @Body() dto: UpdateProfileDto) {
    return this.userAccountService.updateUserProfile(identity.payload!.uid!, dto)
  }

  @Post('unlink')
  @SuccessResponse('Unlink identity succeeded')
  unlinkIdentity(@RequestContext() { identity }: IRequestContext, @Body() { provider }: RemoveIdentityDto) {
    return this.userAccountService.removeIdentity(identity.payload!.uid!, provider)
  }

  @Post('destroy')
  @Throttle({ default: { ttl: hours(1), limit: 5 } })
  async requestDestroyAccount(
    @RequestContext() { identity }: IRequestContext,
    @Body() { delete_comments }: DestroyAccountDto
  ) {
    const user = await this.userService.findOne(identity.payload!.uid!)
    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject: `Account Destruction Request - ${user.name} (#${user.id})`,
      ...linesToEmailContent([
        `Target: [${user.name}] requested to destroy their account.`,
        ``,
        `User ID: ${user.id}`,
        `User Name: ${user.name}`,
        `User Email: ${user.email ?? 'N/A'}`,
        `User Website: ${user.website ?? 'N/A'}`,
        `Identities: ${user.identities.map((id) => id.provider).join(', ')}`,
        `Comment Strategy: ${delete_comments ? 'Delete all comments' : 'Keep comments data (Anonymized)'}`,
        ``,
        `Request Time: ${new Date().toLocaleString()}`,
        `Action Required: Please manually verify and perform the deletion in the database.`
      ])
    })
  }

  @Get('vote')
  @SuccessResponse('Get votes succeeded')
  async getUsersAllVotes(@RequestContext() { identity }: IRequestContext): Promise<Vote[]> {
    const user = await this.userService.findOne(identity.payload!.uid!)
    return await this.userActivityService.getAllVotes(user._id)
  }

  @Get('comment')
  @SuccessResponse('Get comments succeeded')
  async getUsersAllComments(@RequestContext() { identity }: IRequestContext): Promise<Comment[]> {
    const user = await this.userService.findOne(identity.payload!.uid!)
    return await this.userActivityService.getAllPublicComments(user._id)
  }

  @Delete('comment')
  @SuccessResponse('Delete comment succeeded')
  async deleteUsersComments(
    @RequestContext() { identity }: IRequestContext,
    @Body() { comment_id }: DeleteCommentDto
  ) {
    const user = await this.userService.findOne(identity.payload!.uid!)
    return await this.userActivityService.deleteComment(user._id, comment_id)
  }
}
