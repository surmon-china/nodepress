const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(mongoose.connection)

// 页面集合模型
let pageSchema = new mongoose.Schema({

  // 页面名称
  name:  String,

  // 别名
  slug: String,

  // 页面描述
  description: String,

  // 页面内容
  content: { type: String, required: true },

  // 文章发布状态 => -1已删除，0草稿，1已发布
  state: { type: Number, default: 1 },

  // 自定义扩展
  extend: [{ name: String, value: String }]

})

//自增ID配置
pageSchema.plugin(autoIncrement.plugin, {
  model: 'Page',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})
pageSchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now()
  if (!this.isNew) this.update_time = Date.now()
  next()
})

// 页面模型
const Page = mongoose.model('Page', pageSchema)

// export
module.exports = Page
