/**
 * @file Disqus controller
 * @module module/disqus/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyReply } from 'fastify'
import { Controller, UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { Get, Post, Delete, Query, Body, Header, Response } from '@nestjs/common'
import { Throttle, seconds } from '@nestjs/throttler'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { UploadedFile, IUploadedFile } from '@app/decorators/uploaded-file.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { CommentBase } from '@app/modules/comment/comment.model'
import { EventKeys } from '@app/constants/events.constant'
import { DISQUS } from '@app/app.config'
import { AccessToken } from '@app/utils/disqus'
import { DisqusPublicService } from './disqus.service.public'
import { DisqusPrivateService } from './disqus.service.private'
import { DisqusToken, TOKEN_COOKIE_KEY, encodeToken } from './disqus.token'
import { CallbackCodeDTO, ThreadPostIdDTO, CommentIdDTO, GeneralDisqusParams } from './disqus.dto'

@Controller('disqus')
export class DisqusController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly disqusPublicService: DisqusPublicService,
    private readonly disqusPrivateService: DisqusPrivateService
  ) {}

  // --------------------------------
  // for client Disqus user

  @Get('config')
  @SuccessResponse('Get Disqus config succeeded')
  getConfig() {
    return {
      forum: DISQUS.forum,
      admin_username: DISQUS.adminUsername,
      public_key: DISQUS.publicKey,
      authorize_url: this.disqusPublicService.getAuthorizeURL()
    }
  }

  @Get('close-window.js')
  closeWindowScript(@Response() response: FastifyReply) {
    response.type('application/javascript').send('window.close();')
  }

  @Get('oauth-callback')
  async oauthCallback(@Query() query: CallbackCodeDTO, @Response() response: FastifyReply) {
    const accessToken = await this.disqusPublicService.getAccessToken(query.code)
    // Cache user info
    this.disqusPublicService.setUserInfoCache(
      accessToken.user_id,
      await this.disqusPublicService.getUserInfo(accessToken.access_token),
      accessToken.expires_in
    )
    // https://github.com/fastify/fastify-cookie?tab=readme-ov-file#options
    response.setCookie(TOKEN_COOKIE_KEY, encodeToken(accessToken), {
      maxAge: accessToken.expires_in * 1000,
      httpOnly: true,
      secure: 'auto'
    })
    // Close the popup window
    response.header('content-type', 'text/html')
    response.send(`<!DOCTYPE html><html><script src="/disqus/close-window.js"></script></html>`)
    // To maintain a secure `content-security-policy`, inline JavaScript is not used here.
    // response.send(`<script>window.close();</script>`)
  }

  @Post('oauth-logout')
  oauthLogout(@DisqusToken() token: AccessToken | null, @Response() response: FastifyReply) {
    if (token) this.disqusPublicService.deleteUserInfoCache(token.user_id)
    response.clearCookie(TOKEN_COOKIE_KEY)
    response.header('content-type', 'text/plain')
    response.send('Disqus OAuth logout succeeded')
  }

  @Get('user-info')
  @SuccessResponse('Get Disqus user info succeeded')
  getUserInfo(@DisqusToken() token: AccessToken | null) {
    if (!token) throw new UnauthorizedException('You are not logged in')
    return this.disqusPublicService.getUserInfoCache(token.user_id).then((cached) => {
      return cached ?? this.disqusPublicService.getUserInfo(token.access_token)
    })
  }

  @Get('thread')
  @SuccessResponse('Get Disqus thread info succeeded')
  getThread(@Query() query: ThreadPostIdDTO) {
    return this.disqusPublicService.ensureThreadDetailCache(Number(query.post_id))
  }

  @Post('comment')
  @Throttle({ default: { ttl: seconds(30), limit: 6 } })
  @SuccessResponse('Create universal comment succeeded')
  createComment(
    @RequestContext() { visitor }: IRequestContext,
    @DisqusToken() token: AccessToken | null,
    @Body() comment: CommentBase
  ) {
    return this.disqusPublicService.createUniversalComment(comment, visitor, token?.access_token).catch((error) => {
      this.eventEmitter.emit(EventKeys.CommentCreateFailed, { comment, visitor, error })
      return Promise.reject(error)
    })
  }

  @Delete('comment')
  @SuccessResponse('Delete universal comment succeeded')
  deleteComment(@Body() payload: CommentIdDTO, @DisqusToken() token: AccessToken | null) {
    if (!token) throw new UnauthorizedException('You are not logged in')
    return this.disqusPublicService.deleteUniversalComment(payload.comment_id, token.access_token)
  }

  // --------------------------------
  // for nodepress admin

  @Get('threads')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Get Disqus threads succeeded')
  getThreads(@Query() query: GeneralDisqusParams) {
    return this.disqusPrivateService.getThreads(query)
  }

  @Get('posts')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Get Disqus posts succeeded')
  getPosts(@Query() query: GeneralDisqusParams) {
    return this.disqusPrivateService.getPosts(query)
  }

  @Post('post')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update Disqus post succeeded')
  updatePost(@Body() body) {
    return this.disqusPrivateService.updatePost(body)
  }

  @Post('thread')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update Disqus thread succeeded')
  updateThread(@Body() body) {
    return this.disqusPrivateService.updateThread(body)
  }

  @Get('export-xml')
  @UseGuards(AdminOnlyGuard)
  @Header('content-type', 'application/xml')
  exportXML() {
    return this.disqusPrivateService.exportXMLFromNodepress()
  }

  @Post('import-xml')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Import XML from Disqus succeeded')
  importXML(@UploadedFile() file: IUploadedFile) {
    if (!['application/xml', 'text/xml'].includes(file.mimetype)) {
      throw new BadRequestException('Only XML files are allowed for import')
    }
    return this.disqusPrivateService.importXMLToNodepress(file.buffer)
  }
}
