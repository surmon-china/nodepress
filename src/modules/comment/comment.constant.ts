/**
 * @file Comment constants
 * @module module/comment/constant
 * @author Surmon <https://github.com/surmon-china>
 */

export enum CommentTargetType {
  Article = 'article',
  Page = 'page'
}

export enum CommentStatus {
  Pending = 0,
  Published = 1,
  Trash = -1,
  Spam = -2
}

export enum CommentAuthorType {
  Guest = 'guest',
  User = 'user'
}

export enum CommentAuthorStatus {
  Guest = 'guest',
  Active = 'active',
  Ghost = 'ghost'
}

export const COMMENT_PUBLIC_FILTER = Object.freeze({
  status: CommentStatus.Published
})
