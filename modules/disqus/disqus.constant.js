"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIDByThreadIdentifier = exports.getThreadIdentifierById = exports.ARTICLE_THREAD_ID_EXTEND_KEY = exports.COMMENT_ANONYMOUS_EXTEND_KEY = exports.COMMENT_AUTHOR_USERNAME_EXTEND_KEY = exports.COMMENT_AUTHOR_ID_EXTEND_KEY = exports.COMMENT_THREAD_ID_EXTEND_KEY = exports.COMMENT_POST_ID_EXTEND_KEY = exports.DISQUS_OAUTH_CALLBACK_URL = void 0;
const app_config_1 = require("../../app.config");
const app_environment_1 = require("../../app.environment");
const biz_constant_1 = require("../../constants/biz.constant");
exports.DISQUS_OAUTH_CALLBACK_URL = app_environment_1.isProdEnv
    ? `${app_config_1.APP_BIZ.URL}/disqus/oauth-callback`
    : `http://localhost:${app_config_1.APP_BIZ.PORT}/disqus/oauth-callback`;
exports.COMMENT_POST_ID_EXTEND_KEY = 'disqus-post-id';
exports.COMMENT_THREAD_ID_EXTEND_KEY = 'disqus-thread-id';
exports.COMMENT_AUTHOR_ID_EXTEND_KEY = 'disqus-author-id';
exports.COMMENT_AUTHOR_USERNAME_EXTEND_KEY = 'disqus-author-username';
exports.COMMENT_ANONYMOUS_EXTEND_KEY = 'disqus-anonymous';
exports.ARTICLE_THREAD_ID_EXTEND_KEY = 'disqus-thread-id';
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
//# sourceMappingURL=disqus.constant.js.map