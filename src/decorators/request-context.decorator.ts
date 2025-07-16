/**
 * @file RequestContext decorator
 * @module decorator/request-context
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyRequest } from 'fastify'
import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

export interface QueryVisitor {
  ip: string | null
  ua: string | undefined
  origin: string | undefined
  referer: string | undefined
}

export interface IRequestContext {
  /** admin role state */
  token: string | undefined
  isAuthenticated: boolean
  isUnauthenticated: boolean
  /** original route params */
  params: Record<string, string>
  /** original query params */
  query: Record<string, string>
  /** visitor cookies */
  cookies: Record<string, string | undefined>
  /** visitor info */
  visitor: QueryVisitor
  /** original request */
  request: FastifyRequest
}

/**
 * @function RequestContext
 * @example ```@RequestContext()```
 */
export const RequestContext = createParamDecorator((_, context: ExecutionContext): IRequestContext => {
  const request = context.switchToHttp().getRequest<FastifyRequest>()
  // NOTE: Fastify already handles proxy IPs via trustProxy.
  // https://fastify.dev/docs/latest/Reference/Server/#trustproxy
  const ip = request.ip ?? request.ips?.[0]

  const visitor: QueryVisitor = {
    ip: ip?.replace('::ffff:', '').replace('::1', '') || null,
    ua: request.headers['user-agent'],
    origin: request.headers.origin,
    referer: request.headers.referer
  }

  return {
    token: request.locals.token,
    isAuthenticated: request.locals.isAuthenticated,
    isUnauthenticated: request.locals.isUnauthenticated,
    params: request.params as Record<string, string>,
    query: request.query as Record<string, string>,
    cookies: request.cookies,
    visitor,
    request
  }
})
