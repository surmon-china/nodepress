/**
 * @file User account controller
 * @module module/account/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Throttle, hours } from '@nestjs/throttler'
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common'
import { EmailService } from '@app/core/helper/helper.service.email'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { linesToEmailContent } from '@app/transformers/email.transformer'
import { Comment } from '@app/modules/comment/comment.model'
import { Vote } from '@app/modules/vote/vote.model'
import { APP_BIZ } from '@app/app.config'
import { UserService } from '@app/modules/user/user.service'
import { UserIdentityProvider } from '@app/modules/user/user.constant'
import { AccountIdentityService } from './account.service.identity'
import { AccountActivityService } from './account.service.activity'
import { UpdateProfileDto, DeletionRequestDto } from './account.dto'

@Controller('account')
@OnlyIdentity(IdentityRole.User)
export class AccountController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly accountIdentityService: AccountIdentityService,
    private readonly accountActivityService: AccountActivityService
  ) {}

  @Get('profile')
  @SuccessResponse('Get profile succeeded')
  getProfile(@RequestContext() { identity }: IRequestContext) {
    return this.userService.findOne(identity.payload!.uid!)
  }

  @Patch('profile')
  @SuccessResponse('Update profile succeeded')
  updateProfile(@RequestContext() { identity }: IRequestContext, @Body() dto: UpdateProfileDto) {
    // Explicitly mapping fields here since we are calling an admin-level superset service.
    return this.userService.update(identity.payload!.uid!, {
      name: dto.name,
      email: dto.email,
      website: dto.website,
      avatar_url: dto.avatar_url
    })
  }

  @Delete('identities/:provider')
  @SuccessResponse('Unlink identity succeeded')
  unlinkIdentity(
    @RequestContext() { identity }: IRequestContext,
    @Param('provider') provider: UserIdentityProvider
  ) {
    return this.accountIdentityService.removeIdentity(identity.payload!.uid!, provider)
  }

  @Post('deletion-request')
  @Throttle({ default: { ttl: hours(1), limit: 5 } })
  async requestDestroyAccount(
    @RequestContext() { identity }: IRequestContext,
    @Body() { delete_comments }: DeletionRequestDto
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

  @Get('votes')
  @SuccessResponse('Get votes succeeded')
  async getUsersAllVotes(@RequestContext() { identity }: IRequestContext): Promise<Vote[]> {
    const user = await this.userService.findOne(identity.payload!.uid!)
    return await this.accountActivityService.getAllVotes(user._id)
  }

  @Get('comments')
  @SuccessResponse('Get comments succeeded')
  async getUsersAllComments(@RequestContext() { identity }: IRequestContext): Promise<Comment[]> {
    const user = await this.userService.findOne(identity.payload!.uid!)
    return await this.accountActivityService.getAllPublicComments(user._id)
  }

  @Delete('comments/:id')
  @SuccessResponse('Delete comment succeeded')
  async deleteUsersComment(@Param('id', ParseIntPipe) id: number, @RequestContext() { identity }: IRequestContext) {
    const user = await this.userService.findOne(identity.payload!.uid!)
    return await this.accountActivityService.deleteComment(user._id, id)
  }
}
