/**
 * AnnouncementCtrl module.
 * @file 公告控制器模块
 * @module controller/announcement
 * @author Surmon <https://github.com/surmon-china>
 */

const authIsVerified = require('np-utils/np-auth')
const Announcement = require('np-model/announcement.model')
const { arrayIsInvalid } = require('np-helper/np-data-validate')
const { PUBLISH_STATE, SORT_TYPE } = require('np-core/np-constants')
const {
	handleError,
	handleSuccess,
	humanizedHandleError,
	humanizedHandleSuccess,
	handlePaginateData,
	buildController,
	initController
} = require('np-core/np-processor')

// controller
const AnnouncementCtrl = initController(['list', 'item'])

// 获取公告列表
AnnouncementCtrl.list.GET = (req, res) => {

	// 初始参数
	const keyword = req.query.keyword
	const [page, per_page, state] = [
		req.query.page || 1,
		req.query.per_page,
		req.query.state,
	].map(k => Number(k))

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
	
	// 关键词查询
	if (keyword) {
		query.content = new RegExp(keyword)
	}
	
	// 按照 type 查询
	if ([PUBLISH_STATE.draft, PUBLISH_STATE.published].includes(state)) {
		query.state = state
	}

	// 如果是前台请求，则重置公开状态和发布状态
	if (!authIsVerified(req)) {
		query.state = PUBLISH_STATE.published
	}

	// 请求
	Announcement.paginate(query, options)
		.then(announcements => {
			handleSuccess({
				res,
				message: '公告列表获取成功',
				result: handlePaginateData(announcements)
			})
		})
		.catch(humanizedHandleError(res, '公告列表获取失败'))
}

// 发布公告
AnnouncementCtrl.list.POST = ({ body: announcement }, res) => {
	new Announcement(announcement).save()
		.then(humanizedHandleSuccess(res, '公告发布成功'))
		.catch(humanizedHandleError(res, '公告发布失败'))
}

// 批量删除公告
AnnouncementCtrl.list.DELETE = ({ body: { announcements }}, res) => {

	// 验证
	if (arrayIsInvalid(announcements)) {
		return handleError({ res, message: '缺少有效参数' })
	}

	// 删除
	Announcement.deleteMany({ _id: { $in: announcements }})
		.then(humanizedHandleSuccess(res, '公告批量删除成功'))
		.catch(humanizedHandleError(res, '公告批量删除失败'))
}

// 修改单个公告
AnnouncementCtrl.item.PUT = ({ params: { announcement_id }, body: announcement }, res) => {

	if (!announcement.content) {
		return handleError({ res, message: '内容不合法' })
	}

	Announcement.findByIdAndUpdate(announcement_id, announcement, { new: true })
		.then(humanizedHandleSuccess(res, '公告修改成功'))
		.catch(humanizedHandleError(res, '公告修改失败'))
}

// 删除单个公告
AnnouncementCtrl.item.DELETE = ({ params: { announcement_id }}, res) => {
	Announcement.findByIdAndRemove(announcement_id)
		.then(humanizedHandleSuccess(res, '公告删除成功'))
		.catch(humanizedHandleError(res, '公告删除失败'))
}

exports.list = buildController(AnnouncementCtrl.list)
exports.item = buildController(AnnouncementCtrl.item)
