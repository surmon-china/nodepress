/**
 * LikeCtrl module.
 * @file 喜欢功能控制器模块
 * @module controller/like
 * @author Surmon <https://github.com/surmon-china>
 */

const consola = require('consola')
const Option = require('np-model/option.model')
const Article = require('np-model/article.model')
const Comment = require('np-model/comment.model')
const { objectValues } = require('np-helper/np-data-validate')
const { LIKE_TYPE, COMMENT_POST_TYPE } = require('np-core/np-constants')
const {
	handleError,
	handleSuccess,
	humanizedHandleError
} = require('np-core/np-processor')

module.exports = ({ body: { id, type }}, res) => {

	// 验证参数的正确性，1 => 评论，2 => 页面
	if (!objectValues(LIKE_TYPE).includes(type)) {
		return handleError({ res, message: '喜欢失败，没有原因' })
	}

	// like
	const isLikeGuestook = id === COMMENT_POST_TYPE.guestbook
	const ModelService = type === LIKE_TYPE.comment
		? Comment
		: (isLikeGuestook ? Option : Article)

	ModelService
	.findOne(isLikeGuestook ? {} : { id })
		.then(result => {
			type === LIKE_TYPE.comment
				? result.likes++
				: result.meta.likes++
			result.save().then(info => {
				// consola.success('赞更新成功', info)
			}).catch(err => {
				consola.warn('赞更新失败', err)
			})
			handleSuccess({ res, message: '爱你么么扎' })
		})
		.catch(humanizedHandleError(res, '喜欢失败'))
}
