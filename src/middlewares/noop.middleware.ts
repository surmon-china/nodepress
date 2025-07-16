/**
 * @file Noop middleware
 * @description This middleware is used as a no-operation (noop) placeholder.
 * @module middleware/noop
 * @author Surmon <https://github.com/surmon-china>
 */

import type { IncomingMessage, OutgoingMessage } from 'http'
import { Injectable, NestMiddleware } from '@nestjs/common'

@Injectable()
export class NoopMiddleware implements NestMiddleware {
  // https://github.com/nestjs/nest/issues/9865#issuecomment-1174056923
  use(request: IncomingMessage, response: OutgoingMessage, next: () => void) {
    // MARK: noop middleware
    next()
  }
}
