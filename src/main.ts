/**
 * @file App entry
 * @module app/main
 * @author Surmon <https://github.com/surmon-china>
 */

import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import type { ValidationError } from 'class-validator'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'
import { TransformInterceptor } from '@app/interceptors/transform.interceptor'
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor'
import { HttpExceptionFilter } from '@app/filters/exception.filter'
import { Identity, IdentityRole } from '@app/constants/identity.constant'
import { AuthRole } from '@app/constants/auth.constant'
import { AuthService } from '@app/core/auth/auth.service'
import { environment, isDevEnv } from './app.environment'
import { AppModule } from './app.module'
import { APP_BIZ } from './app.config'
import logger from '@app/utils/logger'

async function bootstrap() {
  // https://fastify.dev/docs/latest/Reference/Server/#trustproxy
  const adapter = new FastifyAdapter({ logger: false, trustProxy: true })
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger: ['fatal', 'error', 'warn']
  })

  // Register fastify plugins
  await app.register(fastifyCookie)
  await app.register(fastifyMultipart, { limits: { fileSize: 1024 * 1024 * 20 }, throwFileSizeLimit: true })

  // Authentication initialization must be done as early as possible (before Guards).
  // Since NestMiddleware receives a Node.js IncomingMessage (not FastifyRequest),
  // mutations made in middleware cannot be accessed in Guards/Pipes/Interceptors.
  // Therefore, Fastify's `onRequest` hook is used to access the full request object.
  // Reference: https://github.com/nestjs/nest/issues/9865#issuecomment-1174056923
  // Reference: https://stackoverflow.com/a/79056477/6222535
  const authService = app.get(AuthService)
  const fastify = app.getHttpAdapter().getInstance()
  // Use Fastify 'onRequest' hook for early-stage identity authentication
  fastify.addHook('onRequest', async (request) => {
    // Initialize default identity as Guest (Anonymous mode)
    request.identity = new Identity({ role: IdentityRole.Guest })
    // Extract token from authorization header, skip if not provided
    const token = authService.extractTokenFromAuthorization(request.headers.authorization)
    if (!token) return

    try {
      // Verify the token. If an identity is declared, it MUST be valid (Explicit Failure policy)
      const payload = await authService.verifyToken(token)
      if (!payload) throw new UnauthorizedException('Access denied: invalid identity payload')
      // Map AuthRole to IdentityRole based on token payload
      if (payload.role === AuthRole.Admin) {
        request.identity = new Identity({ role: IdentityRole.Admin, token, payload })
      } else if (payload.role === AuthRole.User) {
        request.identity = new Identity({ role: IdentityRole.User, token, payload })
      }
    } catch (error) {
      // Fail explicitly if the token is invalid (expired, forged, or tampered)
      // This prevents confusion and enhances security for authenticated users
      throw error instanceof UnauthorizedException
        ? error
        : new UnauthorizedException('Authentication failed: token expired or malformed', { cause: error })
    }
  })

  // Enable CORS https://github.com/fastify/fastify-cors
  app.enableCors({
    // Allow all origins in development, restrict in production
    origin: isDevEnv ? true : APP_BIZ.CORS_ALLOWED_ORIGINS,
    preflight: true,
    credentials: true,
    maxAge: 600,
    methods: ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    // Defaults to reflecting the headers specified in the request's Access-Control-Request-Headers header if not specified.
    // allowedHeaders: [...]
  })

  // Register global filters and interceptors
  if (isDevEnv) app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(
    // https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const collectMessages = (_errors: ValidationError[]) => {
          const messages: string[] = []
          for (const error of _errors) {
            if (error.constraints) messages.push(...Object.values<any>(error.constraints))
            if (error.children?.length) messages.push(...collectMessages(error.children))
          }
          return messages
        }

        throw new BadRequestException(`Validation failed: ${collectMessages(errors).join('; ')}`)
      }
    })
  )

  return await app.listen(APP_BIZ.PORT)
}

bootstrap().then((server) => {
  logger.success(
    `${APP_BIZ.NAME} app is running!`,
    `| env: ${environment}`,
    `| at: ${JSON.stringify(server.address())}`
  )
})
