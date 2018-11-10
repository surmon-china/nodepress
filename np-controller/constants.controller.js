/**
 * GithubCtrl module.
 * @file Github 控制器模块
 * @module controller/github
 * @author Surmon <https://github.com/surmon-china>
 */

const constants = require('np-core/np-constants')
const { handleSuccess } = require('np-core/np-processor')

// 获取内存中项目列表数据
module.exports = (_, res) => {
	handleSuccess({
		res,
		result: {
			SORT_TYPE: constants.SORT_TYPE,
			LIKE_TYPE: constants.LIKE_TYPE,
			PUBLIC_STATE: constants.PUBLIC_STATE,
			ORIGIN_STATE: constants.ORIGIN_STATE,
			PUBLISH_STATE: constants.PUBLISH_STATE,
			COMMENT_STATE: constants.COMMENT_STATE
		},
		message: '配置常量获取成功'
	})
}
