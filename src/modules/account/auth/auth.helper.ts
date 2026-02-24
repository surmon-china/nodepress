import type { FastifyReply } from 'fastify'
import { ResponseStatus } from '@app/interfaces/response.interface'
import { isDevEnv } from '@app/app.environment'
import { APP_BIZ } from '@app/app.config'
import { AuthIntent } from './auth.service.state'

const MESSAGE_SOURCE = 'nodepress-oauth'

export type PostMessagePayload =
  | {
      status: ResponseStatus.Success
      type: AuthIntent
      token?: string
    }
  | {
      status: ResponseStatus.Error
      error: string
    }

export const sendWindowPostMessage = (response: FastifyReply, payload: PostMessagePayload) => {
  response.header('content-type', 'text/html')
  response.send(`
    <!DOCTYPE html>
    <html>
      <script>
        const payload = ${JSON.stringify(payload)}
        window.opener?.postMessage({
          source: '${MESSAGE_SOURCE}',
          ...payload
        }, '${isDevEnv ? '*' : APP_BIZ.FE_URL}')
        window.close()
      </script>
    </html>
  `)
}
