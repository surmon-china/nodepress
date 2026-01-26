/**
 * @file Options controller
 * @module module/options/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminOptionalGuard } from '@app/guards/admin-optional.guard'
import { OptionsService } from './options.service'
import { Option } from './options.model'

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Get()
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse('Get app options succeeded')
  getOptions(@RequestContext() { isAuthenticated }: IRequestContext) {
    return isAuthenticated ? this.optionsService.ensureAppOptions() : this.optionsService.getOptionsCacheForGuest()
  }

  @Put()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update app options succeeded')
  putOptions(@Body() options: Option): Promise<Option> {
    return this.optionsService.putOptions(options)
  }
}
