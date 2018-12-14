/**
 * Github controller.
 * @file Github 控制器模块
 * @module module.github.controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import HttpProcessor from '@app/utils/http.processor';

import { GithubService } from './github.service';
import { IGithubRepositorie } from './github.interface';

@Controller('github')
export class GithubController {

  constructor(private readonly githubService: GithubService) {}

  @Get()
  @HttpProcessor.handle('获取项目列表')
  async getRepositories(): Promise<IGithubRepositorie[]> {
    return await this.githubService.getRepositories();
  }
}
