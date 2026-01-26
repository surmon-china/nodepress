/**
 * @file Comment constants
 * @module module/comment/constant
 * @author Surmon <https://github.com/surmon-china>
 */

export enum CommentStatus {
  Pending = 0, // 待审核
  Published = 1, // 已发布
  Trash = -1, // 回收站
  Spam = -2 // 垃圾评论
}

export const COMMENT_STATUSES = [
  CommentStatus.Pending,
  CommentStatus.Published,
  CommentStatus.Trash,
  CommentStatus.Spam
] as const

export const COMMENT_GUEST_QUERY_FILTER = Object.freeze({
  status: CommentStatus.Published
})
