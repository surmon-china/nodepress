/**
 * @file Options controller
 * @module module/options/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { EventEmitter2 } from '@nestjs/event-emitter'
import { Controller, Get, Patch, Body } from '@nestjs/common'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { GlobalEventKey } from '@app/constants/events.constant'
import { OptionsService } from './options.service'
import { UpdateOptionsDto } from './options.dto'
import { Option } from './options.model'

@Controller('options')
export class OptionsController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly optionsService: OptionsService
  ) {}

  @Get()
  @SuccessResponse('Get app options succeeded')
  getOptions(@RequestContext() { identity }: IRequestContext) {
    return identity.isAdmin ? this.optionsService.ensureOptions() : this.optionsService.getPublicOptionsCache()
  }

  @Patch()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update app options succeeded')
  async updateOptions(@Body() dto: UpdateOptionsDto): Promise<Option> {
    const updated = await this.optionsService.updateOptions(dto)
    this.eventEmitter.emit(GlobalEventKey.OptionsUpdated, updated)
    return updated
  }
}
