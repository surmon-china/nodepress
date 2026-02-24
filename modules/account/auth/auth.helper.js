"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWindowPostMessage = void 0;
const app_environment_1 = require("../../../app.environment");
const app_config_1 = require("../../../app.config");
const MESSAGE_SOURCE = 'nodepress-oauth';
const sendWindowPostMessage = (response, payload) => {
    response.header('content-type', 'text/html');
    response.send(`
    <!DOCTYPE html>
    <html>
      <script>
        const payload = ${JSON.stringify(payload)}
        window.opener?.postMessage({
          source: '${MESSAGE_SOURCE}',
          ...payload
        }, '${app_environment_1.isDevEnv ? '*' : app_config_1.APP_BIZ.FE_URL}')
        window.close()
      </script>
    </html>
  `);
};
exports.sendWindowPostMessage = sendWindowPostMessage;
//# sourceMappingURL=auth.helper.js.map