/*
*
* 文章数据模型
*
*/

const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

// 文章模型
let articleSchema = new mongoose.Schema({

  // 文章标题
  title:  { type: String, required: true },

  // 文章关键字（SEO）
  keywords: [{ type: String }],

  // 文章描述
  description: String,

  // 文章内容
  content: { type: String, required: true },

  // 缩略图
  thumb: String,

  // 文章发布状态 => -1已删除，0草稿，1已发布
  state: { type: Number, default: 1 },

  // 文章公开状态 = // -1私密，0需要密码，1私密
  public: { type: Number, default: 1 },

  // 文章密码 => 加密状态生效
  password: { type: String, default: '' },

  // 发布日期
  date: { type: Date, default: Date.now },

  // 文章标签
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],

  // 文章分类
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],

  // meta: {
  //   views: { type: Number, default: 0 },
  //   favs:  { type: Number, default: 0 },
  //   comments: { type: Number, default: 0 },
  // },

  // 自定义扩展
  extend: [{ name: String, value: Object }]
})

// 翻页 + 自增ID插件配置
articleSchema.plugin(mongoosePaginate)
articleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 自增ID配置
articleSchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now()
  if (!this.isNew) this.update_time = Date.now()
  next()
})

// 文章模型
const Article = mongoose.model('Article', articleSchema)

// export
module.exports = Article
