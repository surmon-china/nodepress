/**
 * Github controller.
 * @file Github 控制器模块
 * @module module.github.controller
 * @author Surmon <https://github.com/surmon-china>
 */

// const { humanizedHandleSuccess, humanizedHandleError } = require('np-core/np-processor');
import { Controller, Get } from '@nestjs/common';
import { THttpResponse } from '@app/interfaces/http';
import requestProcessor from '@app/utils/request.processor';

import { GithubService } from './github.service';
import { IGithubRepositorie } from './github.interface';

// console.log('RequestProcessor', requestProcessor);

@Controller('github')
export class GithubController {

  constructor(private readonly githubService: GithubService) {}

  @Get()
  @requestProcessor.handle('创建操作成功！')
  async getRepositories(): Promise<IGithubRepositorie[]> {
    return await this.githubService.getRepositories();
  }
}
