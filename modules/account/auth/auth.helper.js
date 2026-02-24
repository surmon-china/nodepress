"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAUTH_CALLBACK_SCRIPT = exports.sendWindowPostMessage = void 0;
const app_environment_1 = require("../../../app.environment");
const app_config_1 = require("../../../app.config");
const MESSAGE_SOURCE = 'nodepress-oauth';
const sendWindowPostMessage = (response, payload) => {
    response.header('Cross-Origin-Opener-Policy', 'unsafe-none');
    response.header('content-type', 'text/html');
    response.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Authorizing...</title></head>
      <body>
        <script id="payload" type="application/json">${JSON.stringify(payload)}</script>
        <script src="/account/auth/oauth-callback.js"></script>
      </body>
    </html>
  `);
};
exports.sendWindowPostMessage = sendWindowPostMessage;
exports.OAUTH_CALLBACK_SCRIPT = `
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
      }, '${app_environment_1.isDevEnv ? '*' : app_config_1.APP_BIZ.FE_URL}')

      window.close()
    } catch (error) {
      console.error('OAuth Callback Error:', error)
    }
  })()`;
//# sourceMappingURL=auth.helper.js.map