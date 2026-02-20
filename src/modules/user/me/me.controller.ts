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
import { APP_BIZ } from '@app/app.config'
import { UserService } from '../user.service'
import { UserMeService } from './me.service'
import { UpdateProfileDto, RemoveIdentityDto, DestroyAccountDto } from './me.dto'

@Controller('user/me')
@OnlyIdentity(IdentityRole.User)
export class UserMeController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly meService: UserMeService
  ) {}

  @Get('profile')
  @SuccessResponse('Get profile succeeded')
  getProfile(@RequestContext() { identity }: IRequestContext) {
    return this.userService.findOne(identity.payload!.uid!)
  }

  @Patch('profile')
  @SuccessResponse('Update profile succeeded')
  updateProfile(@RequestContext() { identity }: IRequestContext, @Body() dto: UpdateProfileDto) {
    return this.meService.updateUser(identity.payload!.uid!, dto)
  }

  @Post('unlink')
  @SuccessResponse('Unlink identity succeeded')
  unlinkIdentity(@RequestContext() { identity }: IRequestContext, @Body() { provider }: RemoveIdentityDto) {
    return this.meService.removeIdentity(identity.payload!.uid!, provider)
  }

  @Get('comment')
  @SuccessResponse('Get comments succeeded')
  async getUsersAllComments(@RequestContext() { identity }: IRequestContext): Promise<Comment[]> {
    return []
    // const user = await this.userService.findOne(identity.payload!.uid!)
    // return await this.commentService.getAllByUser(user._id)
    // return this.commentModel.find({ user: user._id }).sort({ created_at: -1 }).lean().exec()
  }

  @Delete('comment')
  @SuccessResponse('Delete comments succeeded')
  async deleteUsersComments(@RequestContext() { identity }: IRequestContext) {
    return 'TODO'
    //   const user = await this.userService.findOne(identity.payload!.uid!)
    //   const comment = await this.commentService.getDetail(id, 'withUser')
    //   if (!comment.user || comment.user.id !== user.id) {
    //     throw new ForbiddenException(`You do not have permission to delete comment '${id}'`)
    //   }
    //   return await this.commentService.batchUpdateStatus([comment.id], CommentStatus.Trash)
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
}
