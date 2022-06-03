/**
 * @file Disqus controller
 * @module module/disqus/controller
 * @author Surmon <https://github.com/surmon-china>
 */

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
import { FileInterceptor } from '@nestjs/platform-express'
import { Throttle } from '@nestjs/throttler'
import { isProdEnv } from '@app/app.environment'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { Responser } from '@app/decorators/responser.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { CommentBase } from '@app/modules/comment/comment.model'
import { DISQUS } from '@app/app.config'
import { AccessToken } from '@app/utils/disqus'
import { DisqusPublicService } from './disqus.service.public'
import { DisqusPrivateService } from './disqus.service.private'
import { DisqusToken, TOKEN_COOKIE_KEY, encodeToken } from './disqus.token'
import { CallbackCodeDTO, ThreadPostIdDTO, CommentIdDTO, GeneralDisqusParams } from './disqus.dto'

@Controller('disqus')
export class DisqusController {
  constructor(
    private readonly disqusPublicService: DisqusPublicService,
    private readonly disqusPrivateService: DisqusPrivateService
  ) {}

  // --------------------------------
  // for client Disqus user

  @Get('config')
  @Responser.handle('Get Disqus config')
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
  @Responser.handle('Disqus OAuth login')
  async oauthCallback(@Query() query: CallbackCodeDTO, @Response() response) {
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
  @Responser.handle('Disqus OAuth logout')
  oauthLogout(@DisqusToken() token: AccessToken | null, @Response() response) {
    if (token) {
      this.disqusPublicService.deleteUserInfoCache(token.user_id)
    }
    response.clearCookie(TOKEN_COOKIE_KEY)
    response.send('ok')
  }

  @Get('user-info')
  @Responser.handle('Get Disqus user info')
  getUserInfo(@DisqusToken() token: AccessToken | null) {
    if (!token) {
      return Promise.reject(`You are not logged in`)
    }

    return this.disqusPublicService.getUserInfoCache(token.user_id).then((cached) => {
      return cached || this.disqusPublicService.getUserInfo(token.access_token)
    })
  }

  @Get('thread')
  @Responser.handle('Get Disqus thread info')
  getThread(@Query() query: ThreadPostIdDTO) {
    return this.disqusPublicService.ensureThreadDetailCache(Number(query.post_id))
  }

  // 30 seconds > limit 6
  @Post('comment')
  @Throttle(6, 30)
  @Responser.handle('Create universal comment')
  createComment(
    @QueryParams() { visitor }: QueryParamsResult,
    @DisqusToken() token: AccessToken | null,
    @Body() comment: CommentBase
  ) {
    return this.disqusPublicService.createUniversalComment(comment, visitor, token?.access_token)
  }

  @Delete('comment')
  @Responser.handle('Delete universal comment')
  deleteComment(@Body() payload: CommentIdDTO, @DisqusToken() token: AccessToken | null) {
    return token
      ? this.disqusPublicService.deleteUniversalComment(payload.comment_id, token.access_token)
      : Promise.reject(`You are not logged in`)
  }

  // --------------------------------
  // for nodepress admin

  @Get('threads')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Get Disqus threads')
  getThreads(@Query() query: GeneralDisqusParams) {
    return this.disqusPrivateService.getThreads(query)
  }

  @Get('posts')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Get Disqus posts')
  getPosts(@Query() query: GeneralDisqusParams) {
    return this.disqusPrivateService.getPosts(query)
  }

  @Post('post')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update Disqus post')
  updatePost(@Body() body) {
    return this.disqusPrivateService.updatePost(body)
  }

  @Post('thread')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update Disqus thread')
  updateThread(@Body() body) {
    return this.disqusPrivateService.updateThread(body)
  }

  @Get('export-xml')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Export XML for Disqus import')
  exportXML(@Response() response) {
    return this.disqusPrivateService.exportXML().then((xml) => {
      response.header('Content-Type', 'application/xml')
      response.send(xml)
    })
  }

  @Post('import-xml')
  @UseGuards(AdminOnlyGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Responser.handle('Import XML from Disqus')
  importXML(@UploadedFile() file: Express.Multer.File) {
    return this.disqusPrivateService.importXML(file)
  }
}
