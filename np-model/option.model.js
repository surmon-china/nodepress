const mongoose = require('mongoose')
const optionSchema = new mongoose.Schema({

  // 设置名称
  title: { type: String, required: true },

  // 设置别名
  slug: { type: String, required: true },

  // 设置分组
  group:  { type: Number, default: 0 },

  // 设置描述
  description: String,

  // 设置数据
  data: { type: mongoose.Schema.Types.Mixed, required: true }

})

const Option = mongoose.model('Option', optionSchema)
module.exports = Option
