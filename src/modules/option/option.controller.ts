/**
 * @file Option controller
 * @module module/option/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminOptionalGuard } from '@app/guards/admin-optional.guard'
import { OptionService } from './option.service'
import { Option } from './option.model'

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get()
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse('Get app options succeeded')
  getOption(@RequestContext() { isAuthenticated }: IRequestContext) {
    return isAuthenticated ? this.optionService.ensureAppOption() : this.optionService.getOptionCacheForGuest()
  }

  @Put()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update app options succeeded')
  putOption(@Body() option: Option): Promise<Option> {
    return this.optionService.putOption(option)
  }
}
