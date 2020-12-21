/**
 * Comment service.
 * @file 评论模块数据服务
 * @module module/comment/service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash';
import { isDevMode } from '@app/app.environment';
import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transformers/model.transformer';
import { getGuestbookPageUrl, getArticleUrl } from '@app/transformers/urlmap.transformer';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { ECommentPostType, ECommentState } from '@app/interfaces/state.interface';
import { IPService } from '@app/processors/helper/helper.service.ip';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { AkismetService, EAkismetActionType } from '@app/processors/helper/helper.service.akismet';
import { OptionService } from '@app/modules/option/option.service';
import { Blacklist } from '@app/modules/option/option.model';
import { Article } from '@app/modules/article/article.model';
import { Comment, CreateCommentBase, PatchComments } from './comment.model';
import * as APP_CONFIG from '@app/app.config';

@Injectable()
export class CommentService {

  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly akismetService: AkismetService,
    private readonly optionService: OptionService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Comment) private readonly commentModel: MongooseModel<Comment>,
  ) {}

  // 邮件通知网站主及目标对象
  private sendMailToAdminAndTargetUser(comment: Comment, permalink: string) {
    const commentTypeText = comment.post_id === ECommentPostType.Guestbook ? '留言' : '评论';
    const getContextPrefix = isReply => {
      const replyText = isReply ? '回复' : '';
      return `来自 ${comment.author.name} 的${commentTypeText}${replyText}：`
    };
    const sendMailText = contentPrefix => `${contentPrefix}${comment.content}`;
    const sendMailHtml = contentPrefix => `
      <p>${contentPrefix}${comment.content}</p><br>
      <a href="${permalink}" target="_blank">[ 点击查看 ]</a>
    `;

    this.emailService.sendMail({
      to: APP_CONFIG.EMAIL.admin,
      subject: `博客有新的${commentTypeText}`,
      text: sendMailText(getContextPrefix(false)),
      html: sendMailHtml(getContextPrefix(false)),
    });

    if (comment.pid) {
      this.commentModel
        .findOne({ id: comment.pid })
        .then(parentComment => {
          this.emailService.sendMail({
            to: parentComment.author.email,
            subject: `你在 ${APP_CONFIG.APP.NAME} 有新的${commentTypeText}回复`,
            text: sendMailText(getContextPrefix(true)),
            html: sendMailHtml(getContextPrefix(true)),
          });
        });
    }
  }

  // 使用 akismet 进行操作
  private submitCommentAkismet(action: EAkismetActionType, comment: Comment, permalink?: string, referer?: string): Promise<void> {
    return this.akismetService[action]({
      permalink,
      user_ip: comment.ip,
      user_agent: comment.agent,
      referrer: referer,
      comment_type: 'comment',
      comment_author: comment.author.name,
      comment_author_email: comment.author.email,
      comment_author_url: comment.author.site,
      comment_content: comment.content,
      is_test: isDevMode,
    });
  }

  // 更新当前所受影响的文章的评论聚合数据
  private async updateCommentCountWithArticle(postIds: number[]) {
    // 过滤无效 post_id 及留言板 ID/0
    postIds = postIds || [];
    postIds = postIds.map(Number).filter(Boolean);

    if (!postIds.length) {
      return false;
    }

    try {
      const counts = await this.commentModel.aggregate([
        { $match: { state: ECommentState.Published, post_id: { $in: postIds }}},
        { $group: { _id: '$post_id', num_tutorial: { $sum: 1 }}},
      ]);

      if (!counts || !counts.length) {
        this.articleModel
          .updateOne(
            { id: postIds[0] },
            { $set: {
              'meta.comments': 0
            }}
          )
          .exec();
          // .then(info => console.info('评论聚合更新成功', info))
          // .catch(error => console.warn('评论聚合更新失败', error));
      } else {
        counts.forEach(count => {
          this.articleModel
            .updateOne(
              { id: count._id },
              { $set: {
                'meta.comments': count.num_tutorial
              }}
            )
            .exec();
            // .then(info => console.info('评论聚合更新成功', info))
            // .catch(error => console.warn('评论聚合更新失败', error));
        });
      }
    } catch (error) {
      console.warn('更新评论 count 聚合数据前，查询失败', error)
    }
  }

  // 根据操作状态处理评论转移 处理评论状态转移，如果是将评论状态标记为垃圾邮件，则同时加入黑名单，以及 submitSpam
  private async updateCommentsStateWithBlacklist(comments: Comment[], state: ECommentState, referrer: string) {
    const option = await this.optionService.getDBOption();
    // 预期行为
    const isSpam = state === ECommentState.Spam;
    const action = isSpam ? EAkismetActionType.SubmitSpam : EAkismetActionType.SubmitHam;

    // 系统黑名单处理，目前不再处理关键词
    const todoFields: ({ [P in keyof Blacklist]?: (comment: Comment) => string }) = {
      mails: (comment) => comment.author.email,
      ips: (comment) => comment.ip,
    };

    // 如果是将评论状态标记为垃圾邮件，则加入黑名单，以及 submitSpam
    // 如果是将评论状态标记为误标邮件，则移出黑名单，以及 submitHam
    Object.keys(todoFields).forEach(field => {
      const data = option.blacklist[field];
      const getCommentField = todoFields[field];
      option.blacklist[field] = isSpam
        ? lodash.uniq([...data, ...comments.map(getCommentField)])
        : data.filter(value => !comments.some(comment => getCommentField(comment) === value));
    });

    // akismet 处理
    comments.forEach(comment => {
      this.submitCommentAkismet(action, comment, null, referrer);
    });

    // 更新黑名单
    option.save()
      .then(() => console.info('评论状态转移后 -> 黑名单更新成功'))
      .catch(error => console.warn('评论状态转移后 -> 黑名单更新失败', error));
  }

  // 检查评论是否匹配系统的黑名单规则（使用设置的黑名单 IP/邮箱/关键词 过滤）
  private async validateCommentByBlacklist(comment: Comment) {
    const { blacklist } = await this.optionService.getDBOption();
    const { keywords, mails, ips } = blacklist;
    const blockIp = ips.includes(comment.ip);
    const blockEmail = mails.includes(comment.author.email);
    const blockKeyword = keywords.length && new RegExp(`${keywords.join('|')}`, 'ig').test(comment.content);
    const isBlocked = blockIp || blockEmail || blockKeyword;
    if (isBlocked) {
      throw '内容 || IP || 邮箱 -> 不合法';
    }
  }

  // 检查评论是否匹配 akismet 的黑名单规则
  private validateCommentByAkismet(comment: Comment, permalink: string, referer: string): Promise<void> {
    return this.submitCommentAkismet(
      EAkismetActionType.CheckSpam,
      comment,
      permalink,
      referer,
    );
  }

  // 请求评论列表
  public getList(querys, options): Promise<PaginateResult<Comment>> {
    return this.commentModel.paginate(querys, options);
  }

  // 创建评论
  public async create(comment: CreateCommentBase, { ip, ua, referer }): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      ip,
      likes: 0,
      is_top: false,
      pid: Number(comment.pid),
      post_id: Number(comment.post_id),
      state: ECommentState.Published,
      agent: ua || comment.agent,
    };

    // 永久链接
    const permalink = newComment.post_id === ECommentPostType.Guestbook
      ? getGuestbookPageUrl()
      : getArticleUrl(newComment.post_id);

    // 检验评论垃圾性质
    await Promise.all([
      this.validateCommentByBlacklist(newComment),
      this.validateCommentByAkismet(newComment, permalink, referer),
    ]);
    // 查询物理 IP 位置
    const ip_location = await this.ipService.query(ip);
    // 保存评论
    const succeedComment = await this.commentModel.create({
      ...newComment,
      ip_location
    });
    // 发布成功后，向网站主及被回复者发送邮件提醒，更新文章聚合数据
    this.sendMailToAdminAndTargetUser(succeedComment, permalink);
    this.updateCommentCountWithArticle([succeedComment.post_id]);
    return succeedComment;
  }

  // 批量修改评论
  public async batchPatchState(action: PatchComments, referer: string) {
    const { comment_ids, post_ids, state } = action;
    const actionResult = await this.commentModel
      .updateMany({ _id: { $in: comment_ids }}, { $set: { state }}, { multi: true })
      .exec();
    // 更新关联数据
    this.updateCommentCountWithArticle(post_ids);
    try {
      const todoComments = await this.commentModel.find({ _id: { $in: comment_ids }});
      this.updateCommentsStateWithBlacklist(todoComments, state, referer);
    } catch (error) {
      console.warn(`对评论进行改变状态 ${state} 时，出现查询错误！`, error);
    }
    return actionResult;
  }

  // 获取单个评论详情
  public getDetail(commentId: Types.ObjectId): Promise<Comment> {
    return this.commentModel.findById(commentId).exec();
  }

  // 获取单个评论详情（使用数字 ID）
  public getDetailByNumberId(commentId: number) {
    return this.commentModel.findOne({ id: commentId }).exec();
  }

  // 修改评论
  public async update(commentId: Types.ObjectId, newComment: Comment, referer: string): Promise<Comment> {
    const comment = await this.commentModel
      .findByIdAndUpdate(commentId, newComment, { new: true })
      .exec();
    this.updateCommentCountWithArticle([comment.post_id]);
    this.updateCommentsStateWithBlacklist([comment], comment.state, referer);
    return comment;
  }

  // 删除单个评论
  public async delete(commentId: Types.ObjectId): Promise<Comment> {
    const comment = await this.commentModel
      .findByIdAndRemove(commentId)
      .exec();
    this.updateCommentCountWithArticle([comment.post_id]);
    return comment;
  }

  // 批量删除评论
  public async batchDelete(commentIds: Types.ObjectId[], postIds: number[]) {
    const result = await this.commentModel
      .deleteMany({ _id: { $in: commentIds }})
      .exec();
    this.updateCommentCountWithArticle(postIds);
    return result;
  }
}
