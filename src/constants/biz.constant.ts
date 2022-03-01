/**
 * @file Business constants & interfaces
 * @module constants/biz
 * @author Surmon <https://github.com/surmon-china>
 */

// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
// language
export enum Language {
  English = 'en', // English
  Chinese = 'zh', // 简体中文
}

// sort
export enum SortType {
  Asc = 1, // 升序
  Desc = -1, // 降序
  Hottest = 2, // 热序
}

// publish state
export enum PublishState {
  Draft = 0, // 草稿
  Published = 1, // 已发布
  Recycle = -1, // 回收站
}

// public state
export enum PublicState {
  Public = 1, // 公开
  Secret = -1, // 私密
  Reserve = 0, // 保留（限制）
}

// origin state
export enum OriginState {
  Original = 0, // 原创
  Reprint = 1, // 转载
  Hybrid = 2, // 混合
}

// comment state
export enum CommentState {
  Auditing = 0, // 待审核
  Published = 1, // 通过正常
  Deleted = -1, // 已删除
  Spam = -2, // 垃圾评论
}

export const GUESTBOOK_POST_ID = 0
export const ROOT_COMMENT_PID = 0
export const ROOT_FEEDBACK_TID = 0
