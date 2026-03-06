import type { FastifyReply } from 'fastify'
import { ResponseStatus } from '@app/interfaces/response.interface'
import { AuthTokenResult } from '@app/core/auth/auth.interface'
import { isDevEnv } from '@app/app.environment'
import { APP_BIZ } from '@app/app.config'
import { AuthIntent } from './auth.service.state'

const MESSAGE_SOURCE = 'nodepress-oauth'

export type PostMessagePayload =
  | {
      status: ResponseStatus.Success
      type: AuthIntent
      auth?: AuthTokenResult
    }
  | {
      status: ResponseStatus.Error
      error: string
    }

export const sendWindowPostMessage = (response: FastifyReply, payload: PostMessagePayload) => {
  // Set COOP to 'unsafe-none' to allow cross-origin communication (postMessage)
  // between the API popup and the main blog frontend.
  response.header('Cross-Origin-Opener-Policy', 'unsafe-none')
  response.header('content-type', 'text/html')
  response.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Authorizing...</title></head>
      <body>
        <script id="payload" type="application/json">${JSON.stringify(payload)}</script>
        <script src="/account/auth/oauth-callback.js"></script>
      </body>
    </html>
  `)
}

export const OAUTH_CALLBACK_SCRIPT = `
  (function () {
    const dataElement = document.getElementById('payload')
    if (!dataElement) return

    try {
      const payload = JSON.parse(dataElement.textContent)

      if (!payload) {
        throw new Error('Missing payload')
      }

      window.opener?.postMessage({
        source: '${MESSAGE_SOURCE}',
        ...payload
      }, '${isDevEnv ? '*' : APP_BIZ.FE_URL}')

      window.close()
    } catch (error) {
      console.error('OAuth Callback Error:', error)
    }
  })()`
