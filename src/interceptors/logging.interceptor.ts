/**
 * @file Logging interceptor
 * @module interceptor/logging
 * @author Surmon <https://github.com/surmon-china>
 */

import type { Observable } from 'rxjs'
import type { FastifyRequest } from 'fastify'
import type { CallHandler, ExecutionContext } from '@nestjs/common'
import { Injectable, NestInterceptor } from '@nestjs/common'
import { createLogger } from '@app/utils/logger'
import { tap } from 'rxjs/operators'

const logger = createLogger({ scope: 'LoggingInterceptor', time: true })

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const content = request.method.padStart(6, '_') + ' -> ' + request.url
    logger.debug('+++ REQ:', content)
    const now = Date.now()
    return next.handle().pipe(tap(() => logger.debug('--- RES:', content, '|', `${Date.now() - now}ms`)))
  }
}
