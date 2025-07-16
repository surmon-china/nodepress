/**
 * @file App entry
 * @module app/main
 * @author Surmon <https://github.com/surmon-china>
 */

import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import { NestFactory } from '@nestjs/core'
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'
import { TransformInterceptor } from '@app/interceptors/transform.interceptor'
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor'
import { HttpExceptionFilter } from '@app/filters/exception.filter'
import { ValidationPipe } from '@app/pipes/validation.pipe'
import { AuthService } from '@app/core/auth/auth.service'
import { environment, isDevEnv } from './app.environment'
import { AppModule } from './app.module'
import { APP_BIZ } from './app.config'
import logger from '@app/utils/logger'

async function bootstrap() {
  // https://fastify.dev/docs/latest/Reference/Server/#trustproxy
  const adapter = new FastifyAdapter({ logger: false, trustProxy: true })
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, { logger: false })

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
  fastify.addHook('onRequest', async (request) => {
    const token = authService.extractTokenFromAuthorization(request.headers.authorization)
    const isAuthenticated = Boolean(token && (await authService.verifyToken(token)))
    request.locals ??= {} as any
    request.locals.token = token
    request.locals.isAuthenticated = isAuthenticated
    request.locals.isUnauthenticated = !isAuthenticated
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
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  if (isDevEnv) app.useGlobalInterceptors(new LoggingInterceptor())

  return await app.listen(APP_BIZ.PORT)
}

bootstrap().then((server) => {
  logger.success(
    `${APP_BIZ.NAME} app is running!`,
    `| env: ${environment}`,
    `| at: ${JSON.stringify(server.address())}`
  )
})
