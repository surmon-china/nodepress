/**
 * @file Disqus constant
 * @module module/disqus/constant
 * @author Surmon <https://github.com/surmon-china>
 */

import { APP_BIZ } from '@app/app.config'
import { isProdEnv } from '@app/app.environment'
import { GUESTBOOK_POST_ID } from '@app/constants/biz.constant'

export const DISQUS_OAUTH_CALLBACK_URL = isProdEnv
  ? `${APP_BIZ.URL}/disqus/oauth-callback`
  : `http://localhost:${APP_BIZ.PORT}/disqus/oauth-callback`

// extends
export const COMMENT_POST_ID_EXTEND_KEY = 'disqus-post-id'
export const COMMENT_THREAD_ID_EXTEND_KEY = 'disqus-thread-id'
export const COMMENT_AUTHOR_ID_EXTEND_KEY = 'disqus-author-id'
export const COMMENT_AUTHOR_USERNAME_EXTEND_KEY = 'disqus-author-username'
export const COMMENT_ANONYMOUS_EXTEND_KEY = 'disqus-anonymous'
export const ARTICLE_THREAD_ID_EXTEND_KEY = 'disqus-thread-id'

// identifier
const GUESTBOOK_IDENTIFIER = 'guestbook'
const ARTICLE_IDENTIFIER_PREFIX = 'article-'
export const getThreadIdentifierById = (postId: number) => {
  return postId === GUESTBOOK_POST_ID ? GUESTBOOK_IDENTIFIER : `${ARTICLE_IDENTIFIER_PREFIX}${postId}`
}
export const getIDByThreadIdentifier = (id: string) => {
  return id === GUESTBOOK_IDENTIFIER ? GUESTBOOK_POST_ID : id.replace(ARTICLE_IDENTIFIER_PREFIX, '')
}
