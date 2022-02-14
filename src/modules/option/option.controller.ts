/**
 * @file Option controller
 * @module module/option/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { Responsor } from '@app/decorators/responsor.decorator'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { OptionService } from './option.service'
import { Option } from './option.model'

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get()
  @UseGuards(AdminMaybeGuard)
  @Responsor.handle('Get site options')
  getOption(@QueryParams() { isAuthenticated }: QueryParamsResult) {
    return isAuthenticated ? this.optionService.ensureAppOption() : this.optionService.getOptionCacheForGuest()
  }

  @Put()
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Update site options')
  putOption(@Body() option: Option): Promise<Option> {
    return this.optionService.putOption(option)
  }
}
