/**
 * Github controller.
 * @file Github 控制器模块
 * @module module.github.controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { HttpStatus } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { THttpSuccessResponse } from '@app/interfaces/http';
import requestProcessor from '@app/utils/request.processor';

import { GithubService } from './github.service';
import { IGithubRepositorie } from './github.interface';

@Controller('github')
export class GithubController {

  constructor(private readonly githubService: GithubService) {}

  @Get()
  @requestProcessor.handle('获取项目列表', HttpStatus.BAD_GATEWAY)
  async getRepositories(): Promise<THttpSuccessResponse<IGithubRepositorie[]>> {
    return requestProcessor.transform<IGithubRepositorie[]>(
      this.githubService.getRepositories(),
    );
  }
}
