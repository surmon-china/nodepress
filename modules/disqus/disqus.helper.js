"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIDByThreadIdentifier = exports.getThreadIdentifierById = exports.DISQUS_OAUTH_CALLBACK_URL = void 0;
const app_config_1 = require("../../app.config");
const app_environment_1 = require("../../app.environment");
const biz_constant_1 = require("../../constants/biz.constant");
exports.DISQUS_OAUTH_CALLBACK_URL = app_environment_1.isProdEnv
    ? `${app_config_1.APP_BIZ.URL}/disqus/oauth-callback`
    : `http://localhost:${app_config_1.APP_BIZ.PORT}/disqus/oauth-callback`;
const GUESTBOOK_IDENTIFIER = 'guestbook';
const ARTICLE_IDENTIFIER_PREFIX = 'article-';
const getThreadIdentifierById = (postId) => {
    return postId === biz_constant_1.GUESTBOOK_POST_ID ? GUESTBOOK_IDENTIFIER : `${ARTICLE_IDENTIFIER_PREFIX}${postId}`;
};
exports.getThreadIdentifierById = getThreadIdentifierById;
const getIDByThreadIdentifier = (id) => {
    return id === GUESTBOOK_IDENTIFIER ? biz_constant_1.GUESTBOOK_POST_ID : id.replace(ARTICLE_IDENTIFIER_PREFIX, '');
};
exports.getIDByThreadIdentifier = getIDByThreadIdentifier;
//# sourceMappingURL=disqus.helper.js.map