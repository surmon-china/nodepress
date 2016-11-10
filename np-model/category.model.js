/*
*
* 分类数据模型
*
*/

const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

// 分类集合模型
let categorySchema = new mongoose.Schema({

  // 分类名称
  name: { type: String, required: true },

  // 别名
  slug: { type: String, required: true },

  // 分类描述
  description: String,

  // 父分类ID
  pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },

  // 创建时间
  created_at: { type: Date, default: Date.now },

  // 自定义扩展
  extend: [{ name: String, value: String }]

})

// 翻页 + 自增ID插件配置
categorySchema.plugin(mongoosePaginate)
categorySchema.plugin(autoIncrement.plugin, {
  model: 'Category',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 自增ID配置
categorySchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now()
  if (!this.isNew) this.update_time = Date.now()
  next()
})

// 分类模型
const Category = mongoose.model('Category', categorySchema)

// 模块化
module.exports = Category
