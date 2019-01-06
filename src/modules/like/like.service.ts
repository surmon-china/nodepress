/**
 * Like service.
 * @file 点赞模块数据服务
 * @module module/like/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { Option } from '@app/modules/option/option.model';
import { Article } from '@app/modules/article/article.model';
import { Comment } from '@app/modules/comment/comment.model';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Option) private readonly optionModel: TMongooseModel<Option>,
    @InjectModel(Article) private readonly articleModel: TMongooseModel<Article>,
    @InjectModel(Comment) private readonly commentModel: TMongooseModel<Comment>,
  ) {}

  // 喜欢主站
  public likeSite(): Promise<Option> {
    return this.optionModel.findOne().exec().then(option => {
      option.meta.likes++;
      return option.save();
    });
  }

  // 喜欢评论
  public likeComment(commentId: Types.ObjectId): Promise<Comment> {
    return this.commentModel.findOne(commentId).exec().then(comment => {
      comment.likes++;
      return comment.save();
    });
  }

  // 喜欢文章
  public likeArticle(articleId: Types.ObjectId): Promise<Article> {
    return this.articleModel.findOne(articleId).exec().then(article => {
      article.meta.likes++;
      return article.save();
    });
  }
}
