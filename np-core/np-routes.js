/**
 * Routes module.
 * @file Routes 模块
 * @module core/routes
 * @author Surmon <https://github.com/surmon-china>
 */

const CONFIG = require('app.config')
const controller = require('np-controller')
const authIsVerified = require('np-utils/np-auth')
const { isProdMode, isDevMode } = require('environment')

const routes = app => {

	// 拦截器
	app.all('*', (req, res, next) => {

		// set Header
		const origin = req.headers.origin || ''
		const allowedOrigins = [...CONFIG.CROSS_DOMAIN.allowedOrigins]
	
		if (allowedOrigins.includes(origin) || isDevMode) {
			res.setHeader('Access-Control-Allow-Origin', origin)
		}
		res.header('Access-Control-Allow-Headers', 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With')
		res.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS')
		res.header('Access-Control-Max-Age', '1728000')
		res.header('Content-Type', 'application/json;charset=utf-8')
		res.header('X-Powered-By', 'Nodepress 1.0.0')

		// OPTIONS request
		if (req.method == 'OPTIONS') {
			return res.sendStatus(200)
		}

		// 如果是生产环境，需要验证用户来源渠道，防止非正常请求
		if (isProdMode) {
			const { origin, referer } = req.headers
			const originVerified = !origin || origin.includes(CONFIG.CROSS_DOMAIN.allowedReferer)
			const refererVerified = !referer || referer.includes(CONFIG.CROSS_DOMAIN.allowedReferer)
			if (!originVerified && !refererVerified) {
				return res.status(403).jsonp({ code: 0, message: '来者何人！' })
			}
		}

<<<<<<< HEAD
		// 排除 (auth 的 post 请求) & (评论的 post 请求) & (like 请求)
=======
		// 排除 (auth 的 post 请求) & (评论的 post 请求) & (like post 请求)
>>>>>>> a345f161df5de5012b9be4202c8049860ffcd00b
		const isPostUrl = (req, url) => Object.is(req.url, url) && Object.is(req.method, 'POST')
		const isLike = isPostUrl(req, '/like')
		const isPostAuth = isPostUrl(req, '/auth')
		const isPostComment = isPostUrl(req, '/comment')
		if (isLike || isPostAuth || isPostComment) {
			return next()
		}

		// 拦截（所有非管路员的非 get 请求，或文件上传请求）
		const notGetRequest = req.method !== 'GET'
		const isFileRequest = req.url === '/qiniu'
		const isGuestRequest = !authIsVerified(req)
		if (isGuestRequest && (notGetRequest || isFileRequest)) {
			return res.status(401).jsonp({ code: 0, message: '来者何人！' })
		}

		// 其他情况都通行
		next()
	})

	// api
	app.get('/', (req, res) => {
		res.jsonp(CONFIG.INFO)
	})

	// auth
	app.all('/auth', controller.auth)

	// 七牛 token
	app.all('/qiniu', controller.qiniu)

	// 全局 option
	app.all('/option', controller.option)

	// sitemap
	app.get('/sitemap.xml', controller.sitemap)

	// like
	app.post('/like', controller.like)

	// github
	app.get('/github', controller.github)

<<<<<<< HEAD
=======
	// statistic
	app.get('/statistic', controller.statistic)

>>>>>>> a345f161df5de5012b9be4202c8049860ffcd00b
	// wallpaper
	app.get('/wallpaper/list', controller.wallpaper.list)
	app.get('/wallpaper/story', controller.wallpaper.story)

	// music
	app.get('/music/pic/:pic_id', controller.music.pic)
	app.get('/music/lrc/:song_id', controller.music.lrc)
	app.get('/music/url/:song_id', controller.music.url)
	app.get('/music/song/:song_id', controller.music.song)
	app.get('/music/list/:play_list_id', controller.music.list)

	// tag
	app.all('/tag', controller.tag.list)
	app.all('/tag/:tag_id', controller.tag.item)

	// category
	app.all('/category', controller.category.list)
	app.all('/category/:category_id', controller.category.item)

	// comment
	app.all('/comment', controller.comment.list)
	app.all('/comment/:comment_id', controller.comment.item)

	// article
	app.all('/article', controller.article.list)
	app.all('/article/:article_id', controller.article.item)

	// announcement
	app.all('/announcement', controller.announcement.list)
	app.all('/announcement/:announcement_id', controller.announcement.item)

	// 404
	app.all('*', (req, res) => {
		res.status(404).jsonp({
			code: 0,
			message: '无效的API请求'
		})
	})
}

module.exports = routes
