import 'fastify'
import { Identity } from '../constants/identity.constant'

declare module 'fastify' {
  interface FastifyRequest {
    validatedQueryParams?: Record<string, any>
    identity: Identity
  }
}
