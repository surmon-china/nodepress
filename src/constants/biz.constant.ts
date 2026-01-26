/**
 * @file Business constants
 * @module constants/biz
 * @author Surmon <https://github.com/surmon-china>
 */

export const GUESTBOOK_POST_ID = 0
export const ROOT_COMMENT_PID = 0
export const ROOT_FEEDBACK_TID = 0

export enum SortOrder {
  Asc = 1, // 升序
  Desc = -1 // 降序
}

export enum SortMode {
  Oldest = SortOrder.Asc, // 从旧到新
  Latest = SortOrder.Desc, // 从新到旧
  Hottest = 2
}
