const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(mongoose.connection)

// 标签集合模型
let tagSchema = new mongoose.Schema({

  // 标签名称
  name:  String,

  // 别名
  slug: String,

  // 标签描述
  description: String,

  // 包含文章数量
  count: Number,

  // 自定义扩展
  extend: [{ name: String, value: String }]

})

//自增ID配置
tagSchema.plugin(autoIncrement.plugin, {
  model: 'Tag',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})
tagSchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now()
  if (!this.isNew) this.update_time = Date.now()
  next()
})

// 标签模型
const Tag = mongoose.model('Tag', tagSchema)

// 模块化
module.exports = Tag
