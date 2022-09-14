/**
 * @file App controller
 * @module app/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Get, Controller } from '@nestjs/common'
import * as APP_CONFIG from './app.config'

@Controller()
export class AppController {
  @Get()
  root(): any {
    return APP_CONFIG.PROJECT
  }
}
