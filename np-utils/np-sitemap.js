/**
 * Sitemap module.
 * @file 网站地图更新器
 * @module utils/sitemap
 * @author Surmon <https://github.com/surmon-china>
 */

const fs = require('fs')
const sm = require('sitemap')
const consola = require('consola')
const config = require('app.config')

const Tag = require('np-model/tag.model')
const Article = require('np-model/article.model')
const Category = require('np-model/category.model')

const pages = [
	{ url: '', changefreq: 'always', priority: 1 },
	{ url: '/about', changefreq: 'monthly', priority: 1 },
	{ url: '/project', changefreq: 'monthly', priority: 1 },
	{ url: '/sitemap', changefreq: 'always', priority: 1 },
	{ url: '/guestbook', changefreq: 'always', priority: 1 }
]

let sitemap = null

// 获取数据
const getDatas = success => {

	// sitemap
	sitemap = sm.createSitemap({
		urls: [...pages],
		cacheTime: 600000,
		hostname: config.INFO.site
	})

	// Tag
	Tag.find().sort({ '_id': -1 })
	.then(tags => {
		tags.forEach(tag => {
			sitemap.add({
				priority: 0.6,
				changefreq: 'daily',
				url: `/tag/${tag.slug}`
			})
		})
		return Category.find().sort({ '_id': -1 })
	})
	.then(categories => {
		categories.forEach(category => {
			sitemap.add({
				priority: 0.6,
				changefreq: 'daily',
				url: `/category/${category.slug}`
			})
		})
		return Article.find({ state: 1, public: 1 }).sort({ '_id': -1 })
	})
	.then(articles => {
		articles.forEach(article => {
			sitemap.add({
				priority: 0.8,
				changefreq: 'daily',
				url: `/article/${article.id}`,
				lastmodISO: article.create_at.toISOString()
			})
		})
		success()
	})
	.catch(err => {
		success()
		consola.warn('生成地图前获取数据库发生错误', err)
	})
}

// 获取地图
const buildSiteMap = (success, error) => {
	getDatas(() => {
		// consola.log('data', sitemap)
		sitemap.toXML((err, xml) => {
			if (err && error) {
				return error(err)
			}
			if (!err && success) {
				success(xml)
				fs.writeFileSync('../surmon.me/static/sitemap.xml', sitemap.toString())
				sitemap = null
			}
		})
	})
}

module.exports = buildSiteMap
