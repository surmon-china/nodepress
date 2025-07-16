import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    locals: {
      token: string | undefined
      isAuthenticated: boolean
      isUnauthenticated: boolean
      validatedQueryParams?: Record<string, any>
    }
  }
}
