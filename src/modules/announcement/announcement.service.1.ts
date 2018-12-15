/**
 * AnnouncementCtrl module.
 * @file 公告控制器模块
 * @module controller/announcement
 * @author Surmon <https://github.com/surmon-china>
 */

const authIsVerified = require('np-utils/np-auth');
const Announcement = require('np-model/announcement.model');
const { arrayIsInvalid } = require('np-helper/np-data-validate');
const { PUBLISH_STATE, SORT_TYPE } = require('np-core/np-constants');
const {
  handleError,
  handleSuccess,
  humanizedHandleError,
  humanizedHandleSuccess,
  handlePaginateData,
  buildController,
  initController,
} = require('np-core/np-processor');

// controller
const AnnouncementCtrl = initController(['list', 'item']);

// 获取公告列表
AnnouncementCtrl.list.GET = (req, res) => {

  // 初始参数
  const keyword = req.query.keyword;
  const [page, per_page, state] = [
    req.query.page || 1,
    req.query.per_page,
    req.query.state,
  ].map(k => Number(k));

  // 过滤条件
  const options = {
    page,
    sort: { _id: SORT_TYPE.desc },
  };

  if (!isNaN(per_page)) {
    options.limit = per_page;
  }

  // 查询参数
  const query = {};

  // 关键词查询
  if (keyword) {
    query.content = new RegExp(keyword);
  }

  // 按照 type 查询
  if ([PUBLISH_STATE.draft, PUBLISH_STATE.published].includes(state)) {
    query.state = state;
  }

  // 如果是前台请求，则重置公开状态和发布状态
  if (!authIsVerified(req)) {
    query.state = PUBLISH_STATE.published;
  }

  // 请求
  Announcement.paginate(query, options)
    .then(announcements => {
      handleSuccess({
        res,
        message: '公告列表获取成功',
        result: handlePaginateData(announcements),
      });
    })
    .catch(humanizedHandleError(res, '公告列表获取失败'));
};

// 发布公告
AnnouncementCtrl.list.POST = ({ body: announcement }, res) => {
  new Announcement(announcement).save()
    .then(humanizedHandleSuccess(res, '公告发布成功'))
    .catch(humanizedHandleError(res, '公告发布失败'));
};

// 批量删除公告
AnnouncementCtrl.list.DELETE = ({ body: { announcements }}, res) => {

  // 验证
  if (arrayIsInvalid(announcements)) {
    return handleError({ res, message: '缺少有效参数' });
  }

  // 删除
  Announcement.deleteMany({ _id: { $in: announcements }})
    .then(humanizedHandleSuccess(res, '公告批量删除成功'))
    .catch(humanizedHandleError(res, '公告批量删除失败'));
};

// 修改单个公告
AnnouncementCtrl.item.PUT = ({ params: { announcement_id }, body: announcement }, res) => {

  if (!announcement.content) {
    return handleError({ res, message: '内容不合法' });
  }

  Announcement.findByIdAndUpdate(announcement_id, announcement, { new: true })
    .then(humanizedHandleSuccess(res, '公告修改成功'))
    .catch(humanizedHandleError(res, '公告修改失败'));
};

// 删除单个公告
AnnouncementCtrl.item.DELETE = ({ params: { announcement_id }}, res) => {
  Announcement.findByIdAndRemove(announcement_id)
    .then(humanizedHandleSuccess(res, '公告删除成功'))
    .catch(humanizedHandleError(res, '公告删除失败'));
};

exports.list = buildController(AnnouncementCtrl.list);
exports.item = buildController(AnnouncementCtrl.item);

import { Component, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { Comment } from './comment.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { CreateArticleDto } from './dto';

import {ArticleRO, ArticlesRO, CommentsRO} from './article.interface';
const slug = require('slug');

@Component()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
  ) {}

  async findAll(query): Promise<ArticlesRO> {

    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    qb.where('1 = 1');

    if ('tag' in query) {
      qb.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }

    if ('author' in query) {
      const author = await this.userRepository.findOne({username: query.author});
      qb.andWhere('article.authorId = :id', { id: author.id });
    }

    if ('favorited' in query) {
      const author = await this.userRepository.findOne({username: query.favorited});
      const ids = author.favorites.map(el => el.id);
      qb.andWhere('article.authorId IN (:ids)', { ids });
    }

    qb.orderBy('article.created', 'DESC');

    const articlesCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany();

    return {articles, articlesCount};
  }

  async findFeed(userId: number, query): Promise<ArticlesRO> {
    const _follows = await this.followsRepository.find( {followerId: userId});
    const ids = _follows.map(el => el.followingId);

    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .where('article.authorId IN (:ids)', { ids });

    qb.orderBy('article.created', 'DESC');

    const articlesCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany();

    return {articles, articlesCount};
  }

  async findOne(where): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne(where);
    return {article};
  }

  async addComment(slug: string, commentData): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});

    const comment = new Comment();
    comment.body = commentData.body;

    article.comments.push(comment);

    await this.commentRepository.save(comment);
    article = await this.articleRepository.save(article);
    return {article};
  }

  async deleteComment(slug: string, id: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});

    const comment = await this.commentRepository.findOneById(id);
    const deleteIndex = article.comments.findIndex(_comment => _comment.id === comment.id);

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentRepository.deleteById(deleteComments[0].id);
      article =  await this.articleRepository.save(article);
      return {article};
    } else {
      return {article};
    }

  }

  async favorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});
    const user = await this.userRepository.findOneById(id);

    const isNewFavorite = user.favorites.findIndex(_article => _article.id === article.id) < 0;
    if (isNewFavorite) {
      user.favorites.push(article);
      article.favoriteCount++;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return {article};
  }

  async unFavorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});
    const user = await this.userRepository.findOneById(id);

    const deleteIndex = user.favorites.findIndex(_article => _article.id === article.id);

    if (deleteIndex >= 0) {

      user.favorites.splice(deleteIndex, 1);
      article.favoriteCount--;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return {article};
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const article = await this.articleRepository.findOne({slug});
    return {comments: article.comments};
  }

  async create(userId: number, articleData: CreateArticleDto): Promise<ArticleEntity> {

    const article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.tagList = articleData.tagList || [];
    article.comments = [];

    const newArticle = await this.articleRepository.save(article);

    const author = await this.userRepository.findOneById(userId);

    if (Array.isArray(author.articles)) {
      author.articles.push(article);
    } else {
      author.articles = [article];
    }

    await this.userRepository.save(author);

    return newArticle;

  }

  async update(slug: string, articleData: any): Promise<ArticleRO> {
    const toUpdate = await this.articleRepository.findOne({ slug});
    const updated = Object.assign(toUpdate, articleData);
    const article = await this.articleRepository.save(updated);
    return {article};
  }

  async delete(slug: string): Promise<void> {
    return await this.articleRepository.delete({ slug});
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
  }
}