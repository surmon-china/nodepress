/**
 * Article model module.
 * @file 文章数据模型
 * @module model/article
 * @author Surmon <https://github.com/surmon-china>
 */

const { mongoose } = require('np-core/np-mongodb')
const mongoosePaginate = require('mongoose-paginate')
const autoIncrement = require('mongoose-auto-increment')
const { PUBLISH_STATE, PUBLIC_STATE, ORIGIN_STATE } = require('np-core/np-constants')

// 文章模型
const articleSchema = new mongoose.Schema({

  // 文章标题
  title:  { type: String, required: true, validate: /\S+/ },

  // 文章关键字（SEO）
  keywords: [{ type: String }],

  // 文章描述
  description: String,

  // 文章内容
  content: { type: String, required: true, validate: /\S+/ },

  // 缩略图
  thumb: String,

  // 文章发布状态 => -1 回收站，0 草稿，1 已发布
  state: { type: Number, default: PUBLISH_STATE.published },

  // 文章公开状态 => -1 私密，0 需要密码，1 公开
  public: { type: Number, default: PUBLIC_STATE.public },

  // 文章转载状态 => 0 原创，1 转载，2 混合
  origin: { type: Number, default: ORIGIN_STATE.original },

  // 文章密码 => 加密状态生效
  password: { type: String, default: '' },

  // 发布日期
  create_at: { type: Date, default: Date.now },

  // 最后修改日期
  update_at: { type: Date, default: Date.now },

  // 文章文章
  article: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],

  // 文章分类
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],

  // 其他元信息
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },

  // 自定义扩展
  extends: [{ 
    name: { type: String, validate: /\S+/ },
    value: { type: String, validate: /\S+/ } 
  }]
})

articleSchema.set('toObject', { getters: true })

// 翻页 + 自增 ID 插件配置
articleSchema.plugin(mongoosePaginate)
articleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 时间更新
articleSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() })
  next()
})

// 列表时用的文章内容虚拟属性
articleSchema.virtual('t_content').get(function() {
  const content = this.content
  return content ? content.substring(0, 130) : content
})

// 文章模型
module.exports = mongoose.model('Article', articleSchema)
