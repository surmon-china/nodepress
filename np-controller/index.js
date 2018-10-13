/**
 * API module.
 * @file API 分发器模块
 * @module controller/api
 * @author Surmon <https://github.com/surmon-china>
 */

exports.tag = require('./tag.controller')
exports.like = require('./like.controller')
exports.auth = require('./auth.controller')
exports.music = require('./music.controller')
exports.qiniu = require('./qiniu.controller')
exports.github = require('./github.controller')
exports.option = require('./option.controller')
exports.sitemap = require('./sitemap.controller')
exports.comment = require('./comment.controller')
exports.article = require('./article.controller')
exports.category = require('./category.controller')
exports.wallpaper = require('./wallpaper.controller')
exports.announcement = require('./announcement.controller')
