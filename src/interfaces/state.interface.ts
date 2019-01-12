/**
 * Bussniss constants.
 * @file 业务数据表常量接口
 * @module interface/state
 * @author Surmon <https://github.com/surmon-china>
 */

// 发布状态
export enum EPublishState {
  Draft = 0, // 草稿
  Published = 1, // 已发布
  Recycle = -1, // 回收站
}

// 公开状态
export enum EPublicState {
  Password = 0, // 需要密码
  Public = 1, // 公开状态
  Secret = -1, // 私密
}

// 转载状态
export enum EOriginState {
  Original = 0, // 原创
  Reprint = 1, // 转载
  Hybrid = 2, // 混合
}

// 评论状态
export enum ECommentState {
  Auditing = 0, // 待审核
  Published = 1, // 通过正常
  Deleted = -1, // 已删除
  Spam = -2, // 垃圾评论
}

// 评论宿主页面的 POST_ID 类型
export enum ECommentPostType {
  Guestbook = 0, // 留言板
}

// 评论本身的类型
export enum ECommentParentType {
  Self = 0, // 自身一级评论
}

// 排序状态
export enum ESortType {
  Asc = 1, // 升序
  Desc = -1, // 降序
  Hot = 2, // 最热
}
