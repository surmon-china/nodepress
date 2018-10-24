/**
 * Sitemap module.
 * @file 网站地图更新器
 * @module utils/sitemap
 * @author Surmon <https://github.com/surmon-china>
 */

const fs = require('fs')
const path = require('path')
const sm = require('sitemap')
const consola = require('consola')
const CONFIG = require('app.config')
const redis = require('np-core/np-redis')
const Tag = require('np-model/tag.model')
const Article = require('np-model/article.model')
const Category = require('np-model/category.model')
const { REDIS_CACHE_FIELDS } = require('np-core/np-constants')
const { PUBLISH_STATE, PUBLIC_STATE, SORT_TYPE } = require('np-core/np-constants')

let sitemap = null

const xmlFilePath = path.format({
	dir: path.join(CONFIG.APP.FRONT_END_PATH, 'static'),
	name: 'sitemap',
	ext: '.xml'
})

const pages = [
	{ url: '', changefreq: 'always', priority: 1 },
	{ url: '/about', changefreq: 'monthly', priority: 1 },
	{ url: '/project', changefreq: 'monthly', priority: 1 },
	{ url: '/sitemap', changefreq: 'always', priority: 1 },
	{ url: '/guestbook', changefreq: 'always', priority: 1 }
]

// 获取数据
const getDatas = success => {

	// sitemap
	sitemap = sm.createSitemap({
		urls: [...pages],
		cacheTime: 600000,
		hostname: CONFIG.APP.URL
	})

	// tag
	const addTags = Tag
	.find()
	.sort({ _id: SORT_TYPE.desc })
	.then(tags => {
		tags.forEach(tag => {
			sitemap.add({
				priority: 0.6,
				changefreq: 'daily',
				url: `/tag/${tag.slug}`
			})
		})
	})

	// category
	const addCategories = Category
	.find()
	.sort({ _id: SORT_TYPE.desc })
	.then(categories => {
		categories.forEach(category => {
			sitemap.add({
				priority: 0.6,
				changefreq: 'daily',
				url: `/category/${category.slug}`
			})
		})
	})

	// article
	const addArticles = Article
	.find({ state: PUBLISH_STATE.published, public: PUBLIC_STATE.public })
	.sort({ _id: SORT_TYPE.desc })
	.then(articles => {
		articles.forEach(article => {
			sitemap.add({
				priority: 0.8,
				changefreq: 'daily',
				url: `/article/${article.id}`,
				lastmodISO: article.create_at.toISOString()
			})
		})
	})

	Promise.all([addTags, addCategories, addArticles])
	.then(data => success && success())
	.catch(err => {
		success && success()
		consola.warn('生成地图前获取数据库发生错误', err)
	})
}

// 获取地图
const updateAndBuildSiteMap = () => {
	return new Promise((resolve, reject) => {
		getDatas(() => {
			sitemap.toXML((err, xml) => {
				if (err) {
					reject(err)
					consola.warn('生成地图 XML 时发生错误', err)
				} else {
					resolve(xml)
					redis.set(REDIS_CACHE_FIELDS.sitemap, xml)
					fs.writeFileSync(xmlFilePath, sitemap.toString())
					sitemap = null
				}
			})
		})
	})
}

module.exports = updateAndBuildSiteMap
