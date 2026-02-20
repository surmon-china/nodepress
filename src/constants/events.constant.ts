/**
 * @file Global events constant
 * @module constant/events
 * @author Surmon <https://github.com/surmon-china>
 */

export enum EventKeys {
  RedisError = 'redis.error',
  DatabaseError = 'database.error',
  AdminLoggedIn = 'admin.logged_in',
  AdminLoggedOut = 'admin.logged_out',
  OptionsUpdated = 'options.updated',
  FeedbackCreated = 'feedback.created',
  VoteCreated = 'vote.created',
  UserCreated = 'user.created',
  UserDeleted = 'user.deleted',
  CommentCreated = 'comment.created',
  CommentCreateFailed = 'comment.create_failed',
  ArticleCreated = 'article.created',
  ArticleUpdated = 'article.updated',
  ArticleDeleted = 'article.deleted'
}
