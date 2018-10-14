/**
 * CategoryCtrl module.
 * @file 分类控制器模块
 * @module controller/category
 * @author Surmon <https://github.com/surmon-china>
 */

const CONFIG = require('app.config')
const authIsVerified = require('np-utils/np-auth')
const buildSiteMap = require('np-utils/np-sitemap')
const Category = require('np-model/category.model')
const Article = require('np-model/article.model')
const { arrayIsInvalid } = require('np-helper/np-data-validate')
const { baiduSeoPush, baiduSeoUpdate } = require('np-utils/np-baidu-seo-push')
const { PUBLISH_STATE, PUBLIC_STATE, SORT_TYPE } = require('np-core/np-constants')
const {
	handleError,
	handleSuccess,
	humanizedHandleError,
	handlePaginateData,
	buildController,
	initController
} = require('np-core/np-processor')

// Controller
const CategoryCtrl = initController(['list', 'item'])

// 获取分类列表
CategoryCtrl.list.GET = (req, res) => {

	const [page, per_page] = [req.query.page || 1, req.query.per_page || 10].map(k => Number(k))

	// 过滤条件
	const options = {
		page,
		limit: per_page,
		sort: { _id: SORT_TYPE.desc }
	}

	const querySuccess = categories => {
		handleSuccess({
			res,
			message: '分类列表获取成功',
			result: handlePaginateData(categories)
		})
	}

	// 查询 article-category 的 count 聚合数据
	const getCatrgoriesCount = categories => {
		const $match = authIsVerified(req) 
			? {}
			: { state: PUBLISH_STATE.published, public: PUBLIC_STATE.public }
		Article.aggregate([
			{ $match },
			{ $unwind: '$category' },
			{ $group: {
				_id: '$category',
				num_tutorial: { $sum: 1 }}
			}
		])
		.then(counts => {
			const newCtefories = categories.docs.map(category => {
				const finded = counts.find(c => String(c._id) === String(category._id))
				category.count = finded ? finded.num_tutorial : 0
				return category
			})
			categories.docs = newCtefories
			querySuccess(categories)
		})
		.catch(_ => {
			querySuccess(categories)
		})
	}

	// 请求
	Category.paginate({}, options)
		.then(categories => getCatrgoriesCount(JSON.parse(JSON.stringify(categories))))
		.catch(humanizedHandleError(res, '分类列表获取失败'))
}

// 创建分类
CategoryCtrl.list.POST = ({ body: category, body: { slug } }, res) => {

	// 如果 pid 为 null 或空值
	if (!category.pid) {
		Reflect.deleteProperty(category, 'pid')
	}

	if (category.slug == undefined) {
		return handleError({ res, message: '缺少slug' })
	}

	// 保存分类
	const saveCategory = () => {
		new Category(category).save()
			.then(result => {
				handleSuccess({ res, result, message: '分类发布成功' })
				buildSiteMap()
				baiduSeoPush(`${CONFIG.APP.URL}/category/${result.slug}`)
			})
			.catch(humanizedHandleError(res, '分类发布失败'))
	}

	// 验证 slug 合法性
	Category.find({ slug })
		.then(categories => {
			categories.length
				? handleError({ res, message: 'slug 已被占用' })
				: saveCategory()
		})
		.catch(humanizedHandleError(res, '分类发布失败'))
}

// 批量删除分类
CategoryCtrl.list.DELETE = ({ body: { categories }}, res) => {

	// 验证
	if (arrayIsInvalid(categories)) {
		return handleError({ res, message: '缺少有效参数' })
	}

	// 把所有 pid 为 categories 中任何一个 id 的分类分别提升到自己分类本身的 PID 分类或者 null
	Category.deleteMany({ _id: { $in: categories }})
		.then(result => {
			handleSuccess({ res, result, message: '分类批量删除成功' })
			buildSiteMap()
		})
		.catch(humanizedHandleError(res, '分类批量删除失败'))
}

// 获取单个分类以及自身的父分类
CategoryCtrl.item.GET = ({ params: { category_id } }, res) => {
	const categories = []
	;((function findCateItem(_id) {
		Category.findById(_id)
			.then(category => {
				if (!category) {
					return arrayIsInvalid(categories)
						? handleError({ res, message: '分类不存在' })
						: handleSuccess({ res, result: categories, message: '分类获取成功' })
				}
				categories.unshift(category)
				const pid = category.pid
				const hasParent = pid && pid !== category.id
				hasParent
					? findCateItem(pid)
					: handleSuccess({ res, result: categories, message: '分类获取成功' })
			})
			.catch(humanizedHandleError(res, '分类获取失败'))
	})(category_id))
}

// 修改单个分类
CategoryCtrl.item.PUT = ({ params: { category_id }, body: category, body: { pid, slug }}, res) => {

	// 校验
	if (!slug) {
		return handleError({ res, message: 'slug 不合法' })
	}

	// 修改
	const putCategory = () => {
		if (['', '0', 'null', 'false'].includes(pid) || !pid || pid === category_id) {
			category.pid = null
		}
		Category.findByIdAndUpdate(category_id, category, { new: true })
			.then(result => {
				handleSuccess({ res, result, message: '分类修改成功' })
				buildSiteMap()
				baiduSeoUpdate(`${CONFIG.APP.URL}/category/${result.slug}`)
			})
			.catch(humanizedHandleError(res, '分类修改失败'))
	}

	// 修改前判断 slug 的唯一性，是否被占用
	Category.find({ slug })
		.then(([existed_category]) => {
			const hasExisted = existed_category && (String(existed_category._id) !== category_id)
			hasExisted
				? handleError({ res, message: 'slug 已存在' })
				: putCategory()
		})
		.catch(humanizedHandleError(res, '分类修改失败'))
}

// 删除单个分类
CategoryCtrl.item.DELETE = ({ params: { category_id }}, res) => {

	// delete category
	const deleteCategory = () => {
		return Category.findByIdAndRemove(category_id)
	}

	// delete pid
	const deletePid = category => {
		return new Promise((resolve, reject) => {
			Category.find({ pid: category_id })
				.then(categories => {
					// 如果没有子分类
					if (!categories.length) {
						return resolve(category)
					}
					// 否则更改父分类的子分类
					const targetCategory = Category.collection.initializeOrderedBulkOp()
					targetCategory
						.find({ _id: { $in: Array.from(categories, c => c._id) }})
						.update({ $set: { pid: category.pid || null }})
					targetCategory
						.execute((err, data) => {
							err ? reject(err) : resolve(category)
						})
				})
				.catch(err => reject(err))
		})
	}

	(async () => {
		const category = await deleteCategory()
		return await deletePid(category)
	})()
	.then((result) => {
		handleSuccess({ res, result, message: '分类删除成功' })
		buildSiteMap()
	})
	.catch(humanizedHandleError(res, '分类删除失败'))
}

exports.list = buildController(CategoryCtrl.list)
exports.item = buildController(CategoryCtrl.item)
