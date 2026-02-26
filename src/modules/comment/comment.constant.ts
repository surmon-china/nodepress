/**
 * @file Comment constants
 * @module module/comment/constant
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralAuthorType } from '@app/constants/author.constant'

export enum CommentTargetType {
  Article = 'article',
  Page = 'page'
}

export enum CommentStatus {
  Pending = 0,
  Approved = 1,
  Trash = -1,
  Spam = -2
}

export enum CommentAuthorType {
  Guest = GeneralAuthorType.Guest,
  User = GeneralAuthorType.User
}

export enum CommentAuthorStatus {
  Guest = 'guest',
  Active = 'active',
  Ghost = 'ghost'
}

export const COMMENT_PUBLIC_FILTER = Object.freeze({
  status: CommentStatus.Approved
})
