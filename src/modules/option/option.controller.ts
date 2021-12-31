/**
 * @file Option controller
 * @module module/option/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { JwtAuthGuard } from '@app/guards/auth.guard'
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard'
import { OptionService } from './option.service'
import { Option } from './option.model'

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.handle('Get site options')
  getOption(@QueryParams() { isAuthenticated }): Promise<Option> {
    return isAuthenticated ? this.optionService.getAppOption() : this.optionService.getOptionUserCache()
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update site options')
  putOption(@Body() option: Option): Promise<Option> {
    return this.optionService.putOption(option)
  }
}
