/**
 * @file RequestContext decorator
 * @module decorator/request-context
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyRequest } from 'fastify'
import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import { Identity } from '@app/constants/identity.constant'

export interface QueryVisitor {
  ip: string | null
  agent: string | null
  origin: string | null
  referer: string | null
}

export interface IRequestContext {
  /** user identity state */
  identity: Identity
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
    agent: request.headers['user-agent'] || null,
    origin: request.headers.origin || null,
    referer: request.headers.referer || null
  }

  return {
    identity: request.identity,
    params: request.params as Record<string, string>,
    query: request.query as Record<string, string>,
    cookies: request.cookies,
    visitor,
    request
  }
})
