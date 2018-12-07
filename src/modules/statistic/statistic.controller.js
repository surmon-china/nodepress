/**
 * StatisticCtrl module.
 * @file Statistic 控制器模块
 * @module controller/statistic
 * @author Surmon <https://github.com/surmon-china>
 */

const schedule = require('node-schedule')
const redis = require('np-core/np-redis')
const { REDIS_CACHE_FIELDS } = require('np-core/np-constants')
const { handleSuccess } = require('np-core/np-processor')

const Article = require('np-model/article.model')
const Comment = require('np-model/comment.model')

const resultData = {}

const getTags = () => redis.get(REDIS_CACHE_FIELDS.tags).then(tags => {
  resultData.tags = tags.docs.length
})

const getViews = () => redis.get(REDIS_CACHE_FIELDS.todayViews).then(views => {
  resultData.views = views || 0
})

const getArticles = () => Article.countDocuments({}, (err, count) => {
  resultData.articles = count
})

const getComments = () => Comment.countDocuments({}, (err, count) => {
  resultData.comments = count
})

schedule.scheduleJob('1 0 0 * * *', () => {
  redis.set(REDIS_CACHE_FIELDS.todayViews, 0)
})

// 获取基本的统计数据
module.exports = (req, res) => {
  Promise.all([
   getTags(),
   getViews(),
   getComments(),
   getArticles()
  ]).then(_ => {
   handleSuccess({
    res,
    message: '统计数据获取成功',
    result: resultData
   })
  })
}
