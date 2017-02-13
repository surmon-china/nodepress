/*
*
* 评论数据模型
*
*/

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');

// 自增ID初始化
autoIncrement.initialize(mongoose.connection);

// 标签模型
const commentSchema = new mongoose.Schema({

  // 评论所在的文章id的id或页面别名
  article_key: { type: String, required: true },

  // 第三方评论id
  third_id: { type: Number },

  // pid，0代表默认留言
  pid: { type: Number, default: 0 },

  // content
  content: { type: String, required: true },

  // 评论产生者
  author: {
  	id: { type: String, default: 0 },
  	ip: { type: String },
  	url: { type: String },
  	name: { type: String, required: true },
  	email: { type: String },
  	agent: { type: String }
  },

  // 状态 0待审核/1通过正常/-1已删除/-2垃圾评论
  state: { type: Number, default: 0 },

  // 发布日期
  create_time: { type: Date, default: Date.now },

  // 最后修改日期
  update_time: { type: Date },

  // 自定义扩展
  extends: [{ name: String, value: Object }]
});

// 翻页 + 自增ID插件配置
commentSchema.plugin(mongoosePaginate)
commentSchema.plugin(autoIncrement.plugin, {
  model: 'Comment',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

// 时间更新
commentSchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now();
  if (!this.isNew) this.update_time = Date.now();
  next();
});

// 标签模型
const Comment = mongoose.model('Comment', commentSchema);

// export
module.exports = Comment;
