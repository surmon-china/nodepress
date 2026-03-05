/**
 * @file Extra keys constants
 * @description {biz}-{type}-{property}
 * @module constants/extra
 * @author Surmon <https://github.com/surmon-china>
 */

// Article AI Summary
export enum ArticleAiSummaryExtraKey {
  Content = 'ai-summary-content',
  Model = 'ai-summary-model',
  Provider = 'ai-summary-provider',
  Timestamp = 'ai-summary-timestamp'
}

// Article AI Review
export enum ArticleAiReviewExtraKey {
  Content = 'ai-review-content',
  Model = 'ai-review-model',
  Provider = 'ai-review-provider',
  Timestamp = 'ai-review-timestamp',
  Link = 'ai-review-link'
}

// Comment AI Generation
export enum CommentAiGenerationExtraKey {
  Flag = 'ai-generated',
  Model = 'ai-model',
  Provider = 'ai-provider'
}

// Comment Disqus (Third-party)
export enum CommentDisqusExtraKey {
  PostId = 'disqus-post-id',
  ThreadId = 'disqus-thread-id',
  AuthorId = 'disqus-author-id',
  AuthorUsername = 'disqus-author-username',
  Anonymous = 'disqus-anonymous'
}
