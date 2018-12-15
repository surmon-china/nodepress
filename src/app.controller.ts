import * as CACHE_KEY from '@app/constants/cache.constant';
import HttpCache from '@app/processors/decorators/cache.decorator';
import { Get, Controller } from '@nestjs/common';
import { INFO } from '@app/app.config';

@Controller()
export class AppController {

  @Get()
  @HttpCache(CACHE_KEY.INFO, 60 * 60)
  root(): any {
   return INFO;
  }
}
