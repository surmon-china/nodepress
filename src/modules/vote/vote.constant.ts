/**
 * @file Vote constants
 * @module module/vote/constant
 * @author Surmon <https://github.com/surmon-china>
 */

export enum VoteType {
  Upvote = 1,
  Downvote = -1
}

export enum VoteTargetType {
  Article = 'article',
  Comment = 'comment'
}

export enum VoteAuthorType {
  Anonymous = 'anonymous',
  Guest = 'guest',
  User = 'user'
}
