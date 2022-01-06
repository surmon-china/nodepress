/**
 * @file Disqus controller
 * @module module/disqus/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { FileInterceptor } from '@nestjs/platform-express'
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Header,
  UploadedFile,
  Response,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { isProdEnv } from '@app/app.environment'
import { JwtAuthGuard } from '@app/guards/auth.guard'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { CreateCommentBase } from '@app/modules/comment/comment.model'
import { DISQUS } from '@app/app.config'
import { AccessToken } from '@app/utils/disqus'
import { DisqusPublicService } from './disqus.service.public'
import { DisqusPrivateService } from './disqus.service.private'
import { CookieToken, TOKEN_COOKIE_KEY, encodeToken } from './disqus.token'
import { CallbackCodePayload, ThreadPostIDPayload, CommentIDPayload, GeneralDisqusParams } from './disqus.model'

@Controller('disqus')
export class DisqusController {
  constructor(
    private readonly disqusPublicService: DisqusPublicService,
    private readonly disqusPrivateService: DisqusPrivateService
  ) {}

  // --------------------------------
  // for client disqus user

  @Get('config')
  @HttpProcessor.handle('Get Disqus config')
  getConfig() {
    return {
      forum: DISQUS.forum,
      admin_username: DISQUS.adminUsername,
      public_key: DISQUS.publicKey,
      authorize_url: this.disqusPublicService.getAuthorizeURL(),
    }
  }

  @Get('oauth-callback')
  @Header('content-type', 'text/html')
  @Header('Content-Security-Policy', "script-src 'unsafe-inline'")
  @HttpProcessor.handle('Dsiqus OAuth login')
  async oauthCallback(@Query() query: CallbackCodePayload, @Response() response) {
    const accessToken = await this.disqusPublicService.getAccessToken(query.code)
    // cache user info
    this.disqusPublicService.setUserInfoCache(
      accessToken.user_id,
      await this.disqusPublicService.getUserInfo(accessToken.access_token),
      accessToken.expires_in
    )
    // http://expressjs.com/en/5x/api.html#res.cookie
    response.cookie(TOKEN_COOKIE_KEY, encodeToken(accessToken), {
      maxAge: accessToken.expires_in * 1000,
      httpOnly: true,
      secure: isProdEnv,
    })
    response.send(`<script>window.close();</script>`)
  }

  @Get('oauth-logout')
  @Header('content-type', 'text/plain')
  @HttpProcessor.handle('Disqus OAuth logout')
  oauthLogout(@CookieToken() token: AccessToken | null, @Response() response) {
    if (token) {
      this.disqusPublicService.deleteUserInfoCache(token.user_id)
    }
    response.clearCookie(TOKEN_COOKIE_KEY)
    response.send('ok')
  }

  @Get('user-info')
  @HttpProcessor.handle('Get Disqus user info')
  getUserInfo(@CookieToken() token: AccessToken | null) {
    if (!token) {
      return Promise.reject(`You are not logged in`)
    }

    return this.disqusPublicService.getUserInfoCache(token.user_id).then((cached) => {
      return cached || this.disqusPublicService.getUserInfo(token.access_token)
    })
  }

  @Get('thread')
  @HttpProcessor.handle('Get Disqus thread info')
  getThread(@Query() query: ThreadPostIDPayload) {
    return this.disqusPublicService.makeSureThreadDetailCache(Number(query.post_id))
  }

  @Post('comment')
  @HttpProcessor.handle('Create universal comment')
  createComment(
    @Body() comment: CreateCommentBase,
    @QueryParams() { visitor },
    @CookieToken() token: AccessToken | null
  ) {
    return this.disqusPublicService.createUniversalComment(comment, visitor, token?.access_token)
  }

  @Delete('comment')
  @HttpProcessor.handle('Delete universal comment')
  deleteComment(@Body() payload: CommentIDPayload, @CookieToken() token: AccessToken | null) {
    return token
      ? this.disqusPublicService.deleteUniversalComment(payload.comment_id, token.access_token)
      : Promise.reject(`You are not logged in`)
  }

  // --------------------------------
  // for nodepress admin

  @Get('threads')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Get Disqus threads')
  getThreads(@Query() query: GeneralDisqusParams) {
    return this.disqusPrivateService.getThreads(query)
  }

  @Get('posts')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Get Disqus posts')
  getPosts(@Query() query: GeneralDisqusParams) {
    return this.disqusPrivateService.getPosts(query)
  }

  @Post('post')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update Disqus post')
  updatePost(@Body() body) {
    return this.disqusPrivateService.updatePost(body)
  }

  @Post('thread')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update Disqus thread')
  updateThread(@Body() body) {
    return this.disqusPrivateService.updateThread(body)
  }

  @Get('export-xml')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Export XML for Disqus import')
  exportXML(@Response() response) {
    return this.disqusPrivateService.exportXML().then((xml) => {
      response.header('Content-Type', 'application/xml')
      response.send(xml)
    })
  }

  @Post('import-xml')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Import XML from Dsiqus')
  importXML(@UploadedFile() file: Express.Multer.File) {
    return this.disqusPrivateService.importXML(file)
  }
}
