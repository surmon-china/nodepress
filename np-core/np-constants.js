/**
 * Constants module.
 * @file 数据表常量模块
 * @module core/constants
 * @author Surmon <https://github.com/surmon-china>
 */

// 发布状态
const PUBLISH_STATE = {
  draft: 0, // 草稿
  published: 1, // 已发布
  recycle: -1, // 回收站
}

// 公开状态
const PUBLIC_STATE = {
  password: 0, // 需要密码
  public: 1, // 公开状态
  secret: -1, // 私密
}

// 转载状态
const ORIGIN_STATE = {
  original: 0, // 原创
  reprint: 1, // 转载
  hybrid: -1, // 混合
}

const COMMENT_STATE = {
  auditing: 0, // 待审核
  published: 1, // 通过正常
  deleted: -1, // 已删除
  spam: -2 // 垃圾评论
}

// 评论宿主页面的 POST_ID 类型
const COMMENT_POST_TYPE = {
  guestbook: 0 // 留言板
}

// 评论本身的类型
const COMMENT_PARENT_TYPE = {
  self: 0 // 自身一级评论
}

// 排序状态
const SORT_TYPE = {
  asc: 1, // 升序
  desc: -1 // 降序
}

// 喜欢类型
const LIKE_TYPE = {
	comment: 1,
	page: 2
}

exports.SORT_TYPE = SORT_TYPE
exports.LIKE_TYPE = LIKE_TYPE
exports.PUBLIC_STATE = PUBLIC_STATE
exports.ORIGIN_STATE = ORIGIN_STATE
exports.PUBLISH_STATE = PUBLISH_STATE
exports.COMMENT_STATE = COMMENT_STATE
exports.COMMENT_POST_TYPE = COMMENT_POST_TYPE
exports.COMMENT_PARENT_TYPE = COMMENT_PARENT_TYPE
