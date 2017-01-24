const mongoose = require('mongoose')

let authSchema = new mongoose.Schema({
  name: String,
  slogan: String,
  gravatar: String,
  password: String
})

const Auth = mongoose.model('Auth', authSchema)
module.exports = Auth
