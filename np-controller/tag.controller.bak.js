/**
 * TagCtrl module.
 * @file 标签控制器模块
 * @module controller/tag
 * @author Surmon <https://github.com/surmon-china>
 */

const CONFIG = require('app.config')
const redis = require('np-core/np-redis')
const authIsVerified = require('np-utils/np-auth')
const buildSiteMap = require('np-utils/np-sitemap')
const Tag = require('np-model/tag.model')
const Article = require('np-model/article.model')
const { baiduSeoPush, baiduSeoUpdate } = require('np-utils/np-baidu-seo-push')
const { arrayIsInvalid, getObjectValues } = require('np-helper/np-data-validate')
const { PUBLISH_STATE, PUBLIC_STATE, ORIGIN_STATE, SORT_TYPE } = require('np-core/np-constants')
const {
	handleError,
	handleSuccess,
	humanizedHandleError,
	handlePaginateData,
	buildController,
	initController
} = require('np-core/np-processor')

// Controller
const TagCtrl = initController(['list', 'item'])

let canGetTags = true

// 查询标签列表
const getTags = ({ req, query = {}, options, success, error }) => {

	const doError = err => error && error(err)
	const doSuccess = data => success && success(data)

	// 查询 article-tag 的 count 聚合数据
	const getTagsArticleCount = tags => {
		const $match = req && !authIsVerified(req)
			? { state: PUBLISH_STATE.published, public: PUBLIC_STATE.public }
			: {}
		Article.aggregate([
			{ $match },
			{ $unwind: '$tag' },
			{ $group: {
				_id: '$tag',
				num_tutorial: { $sum: 1 }}
			}
		])
		.then(counts => {
			tags.docs = tags.docs.map(tag => {
				const finded = counts.find(c => String(c._id) === String(tag._id))
				tag.count = finded ? finded.num_tutorial : 0
				return tag
			})
			doSuccess(tags)
		})
		.catch(err => doSuccess(tags))
	}

	// 请求标签
	Tag.paginate(query, options)
		.then(tags => getTagsArticleCount(JSON.parse(JSON.stringify(tags))))
		.catch(doError)
}

// 初始化
setTimeout(() => {
	getTags({
		options: {
			page: 1,
			limit: 160,
			sort: { _id: SORT_TYPE.desc }
		},
		success: tags => redis.set('tags', tags)
	})
}, 0)

// 获取标签列表
TagCtrl.list.GET = (req, res) => {

	const keyword = req.query.keyword
	const [page, per_page] = [req.query.page || 1, req.query.per_page].map(k => Number(k))

	// 过滤条件
	const options = {
		page,
		sort: { _id: SORT_TYPE.desc }
	}

	if (!isNaN(per_page)) {
		options.limit = per_page
	}

	// 查询参数
	const query = {}

	// 关键字查询
	if (keyword)  {
		const keywordReg = new RegExp(keyword)
		query.$or = [
			{ 'name': keywordReg },
			{ 'slug': keywordReg },
			{ 'description': keywordReg }
		]
	}

	// 成功响应
	const querySuccess = tags => {
		handleSuccess({
			res,
			message: '标签列表获取成功',
			result: handlePaginateData(tags)
		})
	}

	// 管理员请求
	if (authIsVerified(req)) {
		return getTags({
			req, query, options,
			success: querySuccess,
			error: humanizedHandleError(res, '标签列表获取失败')
		})
	}

	// 前台请求缓存
	redis.get('tags')
		.then(tags => {
			querySuccess(tags)
			if (canGetTags) {
				getTags({
					req, query, options,
					success: tags => redis.set('tags', tags),
					error: humanizedHandleError(res, '标签列表获取失败')
				})
				canGetTags = false
				setTimeout(() => { canGetTags = true }, 1000 * 60 * 5)
			}
		})
}

// 发布标签
TagCtrl.list.POST = ({ body: tag, body: { slug }}, res) => {

	// 验证
	if (slug == undefined || slug == null) {
		return handleError({ res, message: '缺少slug' })
	}

	// 保存标签
	const saveTag = () => {
		new Tag(tag).save()
			.then((result = tag) => {
				handleSuccess({ res, result, message: '标签发布成功' })
				buildSiteMap()
				baiduSeoPush(`${CONFIG.APP.URL}/tag/${result.slug}`)
			})
			.catch(humanizedHandleError(res, '标签发布失败'))
	}

	// 验证Slug合法性
	Tag.find({ slug })
		.then(({ length }) => {
			length ? handleError({ res, message: 'slug已被占用' }) : saveTag()
		})
		.catch(humanizedHandleError(res, '标签发布失败'))
}

// 批量删除标签
TagCtrl.list.DELETE = ({ body: { tags }}, res) => {

	// 验证
	if (arrayIsInvalid(tags)) {
		return handleError({ res, message: '缺少有效参数' })
	}

	Tag.deleteMany({ _id: { $in: tags }})
		.then(result => {
			handleSuccess({ res, result, message: '标签批量删除成功' })
			buildSiteMap()
		})
		.catch(humanizedHandleError(res, '标签批量删除失败'))
}

// 修改单个标签
TagCtrl.item.PUT = ({ params: { tag_id }, body: tag, body: { slug }}, res) => {

	if (!slug) {
		return handleError({ res, message: 'slug不合法' })
	}

	// 修改
	const putTag = () => {
		Tag.findByIdAndUpdate(tag_id, tag, { new: true })
			.then(result => {
				handleSuccess({ res, result, message: '标签修改成功' })
				buildSiteMap()
				baiduSeoUpdate(`${CONFIG.APP.URL}/tag/${result.slug}`)
			})
			.catch(humanizedHandleError(res, '标签修改失败'))
	}

	// 修改前判断slug的唯一性，是否被占用
	Tag.find({ slug })
		.then(([existed_tag]) => {
			const hasExisted = (existed_tag && (String(existed_tag._id) !== tag_id))
			hasExisted ? handleError({ res, message: 'slug已存在' }) : putTag()
		})
		.catch(humanizedHandleError(res, '修改前查询失败'))
}

// 删除单个标签
TagCtrl.item.DELETE = ({ params: { tag_id }}, res) => {
	Tag.findByIdAndRemove(tag_id)
		.then(result => {
			handleSuccess({ res, result, message: '标签删除成功' })
			buildSiteMap()
		})
		.catch(humanizedHandleError(res, '标签删除失败'))
}

exports.list = buildController(TagCtrl.list)
exports.item = buildController(TagCtrl.item)
