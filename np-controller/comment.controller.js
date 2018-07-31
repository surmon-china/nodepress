/*
*
* 评论控制器
*
*/

const marked = require('marked');
const geoip = require('geoip-lite');

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const { akismetClient } = require('np-utils/np-akismet');
const { sendMail } = require('np-utils/np-email');
const authIsVerified = require('np-utils/np-auth');
const queryIp = require('np-utils/np-ip');

const Comment = require('np-model/comment.model');
const Article = require('np-model/article.model');
const Option = require('np-model/option.model');

const commentCtrl = { list: {}, item: {} };

// 为评论内容创建一个编译器实例
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

// 更新当前所受影响的文章的评论聚合数据
const updateArticleCommentCount = (post_ids = []) => {
	post_ids = [...new Set(post_ids)].filter(id => !!id);
	if (post_ids.length) {
		Comment.aggregate([
			{ $match: { state: 1, post_id: { $in: post_ids }}},
			{ $group: { _id: "$post_id", num_tutorial: { $sum : 1 }}}
		])
		.then(counts => {
			if (counts.length === 0) {
				Article.update({ id: post_ids[0] }, { $set: { 'meta.comments': 0 }})
				.then(info => {
					// console.log('评论聚合更新成功', info);
				})
				.catch(err => {
					// console.warn('评论聚合更新失败', err);
				});
			} else {
				counts.forEach(count => {
					Article.update({ id: count._id }, { $set: { 'meta.comments': count.num_tutorial }})
					.then(info => {
						// console.log('评论聚合更新成功', info);
					})
					.catch(err => {
						// console.warn('评论聚合更新失败', err);
					});
				});
			}
		})
		.catch(err => {
			console.warn('更新评论count聚合数据前，查询失败', err);
		})
	}
};

// 邮件通知网站主及目标对象
const sendMailToAdminAndTargetUser = (comment, permalink) => {
	const commentContent = marked(comment.content);
	const commentType = !!comment.post_id ? '评论' : '留言';
	sendMail({
		to: 'surmon@foxmail.com',
		subject: `博客有新的${commentType}`,
		text: `来自 ${comment.author.name} 的${commentType}：${comment.content}`,
		html: `<p> 来自 ${comment.author.name} 的${commentType}：${commentContent}</p><br><a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
	});
	if (!!comment.pid) {
		Comment.findOne({ id: comment.pid }).then(parentComment => {
			sendMail({
				to: parentComment.author.email,
				subject: `你在 Surmon.me 有新的${commentType}回复`,
				text: `来自 ${comment.author.name} 的${commentType}回复：${comment.content}`,
				html: `<p> 来自${comment.author.name} 的${commentType}回复：${commentContent}</p><br><a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
			});
		})
	};
};

// 根据操作状态处理评论转移
const handleCommentsStateChange = (state, comments, referer) => {
	Option.findOne().then(options => {

		const spam_comment = Object.is(state, -2);
		const { keywords, mails, ips } = options.blacklist;

		// 如果是将评论状态标记为垃圾邮件，则加入黑名单，以及 submitSpam
		if (spam_comment) {
			// console.log('把这些评论拉到黑名单+++');
			options.blacklist.mails = [...new Set([...mails, ...comments.map(comment => comment.author.email)])];
			options.blacklist.keywords = [...new Set([...keywords, ...comments.map(comment => comment.content)])];
			options.blacklist.ips = [...new Set([...ips, ...comments.map(comment => comment.ip)])];

		// 如果是将评论状态标记为误标邮件，则移出黑名单，以及 submitHam
		} else {
			// console.log('把这些评论移出黑名单---');
			options.blacklist.mails = options.blacklist.mails.filter(mail => {
				return !comments.some(comment => Object.is(comment.author.email, mail));
			});
			options.blacklist.keywords = options.blacklist.keywords.filter(keyword => {
				return !comments.some(comment => Object.is(comment.content, keyword));
			});
			options.blacklist.ips = options.blacklist.ips.filter(ip => !comments.some(comment => Object.is(comment.ip, ip)));
		}

		comments.forEach(comment => {
			akismetClient[`submit${spam_comment ? 'Spam' : 'Ham'}`]({
				user_ip: comment.ip,
				user_agent: comment.agent,
				referrer: referer,
				comment_type: 'comment',
				comment_author: comment.author.name,
				comment_author_email: comment.author.email,
				comment_author_url: comment.author.site,
				comment_content: comment.author.content,
				is_test: Object.is(process.env.NODE_ENV, 'development')
			});
		});

		options.save().then(options => {
			// console.log('黑名单什么的已经更新成功', options.blacklist);
		}).catch(err => {
			console.warn('评论状态转译后，黑名单更新失败', err);
		});

	}).catch(err => {
		console.warn(`处理评论状态转移之前，获取系统黑名单失败！${err}`);
	});
};

// 获取评论列表
commentCtrl.list.GET = (req, res) => {

	let { sort = -1, page = 1, per_page = 88, keyword = '', post_id, state } = req.query;
	
	sort = Number(sort);
	state = !Object.is(state, undefined) ? Number(state) : null;

	// 过滤条件
	const options = {
		sort: { _id: sort },
		page: Number(page),
		limit: Number(per_page)
	};

	// 排序字段
	if ([1, -1].includes(sort)) {
		options.sort = { _id: sort };
	} else if (Object.is(sort, 2)) {
		options.sort = { likes: -1 };
	};

	// 查询参数
	let querys = {};

	// 查询各种状态
	if (!Object.is(state, NaN) && [-2, -1, 1, 0].includes(state)) {
		querys.state = state;
	};

	// 如果是前台请求，则重置公开状态和发布状态
	if (!authIsVerified(req)) {
		querys.state = 1;
	};

	// 关键词查询
	if (keyword) {
		const keywordReg = new RegExp(keyword);
		querys['$or'] = [
			{ 'content': keywordReg },
			{ 'author.name': keywordReg },
			{ 'author.email': keywordReg }
		]
	};

	// 通过post-id过滤
	if (!Object.is(post_id, undefined)) {
		querys.post_id = post_id
	}

	// 请求评论
	Comment.paginate(querys, options)
	.then(comments => {
		handleSuccess({
			res,
			message: '评论列表获取成功',
			result: {
				pagination: {
					total: comments.total,
					current_page: options.page,
					total_page: comments.pages,
					per_page: options.limit
				},
				data: comments.docs
			}
		});
	})
	.catch(err => {
		handleError({ res, err, message: '评论列表获取失败' });
	})
};

// 发布评论
commentCtrl.list.POST = (req, res) => {

	const { body: comment } = req

	const doSaveComment = () => {
		if (ip_location) {
			comment.ip_location = {
				city: ip_location.city,
				range: ip_location.range,
				country: ip_location.country
			};
		};
		comment.ip = ip;
		comment.likes = 0;
		comment.is_top = false;
		comment.agent =	req.headers['user-agent'] || comment.agent;

		// 永久链接
		const permalink = 'https://surmon.me/' + (Object.is(comment.post_id, 0) ? 'guestbook' : `article/${comment.post_id}`);

		// 发布评论
		const saveComment = () => {
			new Comment(comment).save()
			.then((result = comment) => {
				handleSuccess({ res, result, message: '评论发布成功' });
				// 发布成功后，向网站主及被回复者发送邮件提醒，并更新网站聚合
				sendMailToAdminAndTargetUser(comment, permalink);
				updateArticleCommentCount([comment.post_id]);
			})
			.catch(err => {
				handleError({ res, err, message: '评论发布失败' });
			})
		};

		// 使用akismet过滤
		akismetClient.checkSpam({
			user_ip: comment.ip,
			user_agent: comment.agent,
			referrer: req.headers.referer,
			permalink,
			comment_type: 'comment',
			comment_author: comment.author.name,
			comment_author_email: comment.author.email,
			comment_author_url: comment.author.site,
			comment_content: comment.content,
			is_test: Object.is(process.env.NODE_ENV, 'development')

		// 使用设置的黑名单ip/邮箱/关键词过滤
		}).then(info => Option.findOne()).then(options => {
			const { keywords, mails, ips } = options.blacklist;
			if (ips.includes(comment.ip) || 
					mails.includes(comment.author.email) ||
				 (keywords.length && eval(`/${keywords.join('|')}/ig`).test(comment.content))) {
				handleError({ res, err: '内容||ip||邮箱 => 不合法', message: '评论发布失败' });
			} else {
				saveComment();
			}
		}).catch(err => {
			handleError({ res, err, message: '评论发布失败' });
		})
	};

	// 获取ip地址以及物理地理地址
	const ip = (req.headers['x-forwarded-for'] || 
							req.headers['x-real-ip'] || 
							req.connection.remoteAddress || 
							req.socket.remoteAddress ||
							req.connection.socket.remoteAddress ||
							req.ip ||
							req.ips[0]).replace('::ffff:', '');
	
	let ip_location = null;
	queryIp(ip).then(data => {
		// console.log('查询到IP', data);
		ip_location = {
			city: data.city,
			country: data.country_id,
		}
		doSaveComment();
	}).catch(err => {
		console.log('阿里云查询IP发生错误，改用本地库', ip, err);
		ip_location = geoip.lookup(ip);
		doSaveComment();
	});
};

// 批量修改（移回收站、回收站恢复）
commentCtrl.list.PATCH = ({ body: { comments, post_ids, state }, headers: { referer }}, res) => {

	state = Object.is(state, undefined) ? null : Number(state)

	// 验证 comments0待审核/1通过正常/-1已删除/-2垃圾评论
	if (!comments || !comments.length || Object.is(state, null) || Object.is(state, NaN) || ![-1, -2, 0, 1].includes(state)) {
		handleError({ res, message: '缺少有效参数或参数无效' });
		return false;
	};

	Comment.update({ '_id': { $in: comments }}, { $set: { state }}, { multi: true })
	.then(result => {
		handleSuccess({ res, result, message: '评论批量操作成功' });
		// 如果处理的状态有超过包含一篇文章评论以上的状态，则更新所相关文章的聚合数据
		if (post_ids && post_ids.length) {
			updateArticleCommentCount(post_ids);
		};
		// 处理评论状态转译，如果是将评论状态标记为垃圾邮件，则加入黑名单，以及 submitSpam
		Comment.find({ '_id': { $in: comments } }).then(todo_comments => {
			handleCommentsStateChange(state, todo_comments, referer);
		}).catch(err => {
			console.log(`批量转译评论数据状态至${state}时，出现错误！${err}`);
		});
	})
	.catch(err => {
		handleError({ res, err, message: '评论批量操作失败' });
	})
};

// 批量删除评论
commentCtrl.list.DELETE = ({ body: { comments, post_ids }}, res) => {

	// 验证
	if (!comments || !comments.length) {
		handleError({ res, message: '缺少有效参数' });
		return false;
	};
	
	Comment.remove({ '_id': { $in: comments }})
	.then(result => {
		handleSuccess({ res, result, message: '评论批量删除成功' });
		if (post_ids && post_ids.length) {
			updateArticleCommentCount(post_ids);
		}
	})
	.catch(err => {
		handleError({ res, err, message: '评论批量删除失败' });
	})
};

// 获取单个评论
commentCtrl.item.GET = ({ params: { comment_id }}, res) => {
	Comment.findById(comment_id)
	.then(result => {
		handleSuccess({ res, result, message: '评论获取成功' });
	})
	.catch(err => {
		handleError({ res, err, message: '评论获取失败' });
	})
};

// 修改单个评论
commentCtrl.item.PUT = ({ params: { comment_id }, body: comment, headers: { referer }}, res) => {
	Comment.findByIdAndUpdate(comment_id, comment, { new: true })
	.then(result => {
		handleSuccess({ res, result, message: '评论修改成功' });
		// 如果评论所属为文章评论，则更新文章所属的聚合数据
		if (comment.post_id) {
			updateArticleCommentCount([comment.post_id]);
		}
		// 处理评论状态转移
		handleCommentsStateChange(comment.state, [comment], referer);
	})
	.catch(err => {
		handleError({ res, err, message: '评论修改失败' });
	})
};

// 删除单个评论
commentCtrl.item.DELETE = ({ params: { comment_id }}, res) => {
	Comment.findByIdAndRemove(comment_id)
	.then(result => {
		handleSuccess({ res, result, message: '评论删除成功' });
	})
	.catch(err => {
		handleError({ res, err, message: '评论删除失败' });
	})
};

// export
exports.list = (req, res) => { handleRequest({ req, res, controller: commentCtrl.list })};
exports.item = (req, res) => { handleRequest({ req, res, controller: commentCtrl.item })};
