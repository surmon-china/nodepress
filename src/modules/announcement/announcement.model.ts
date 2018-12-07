/**
 * Announcement model module.
 * @file 公告数据模型
 * @module model/announcement
 * @author Surmon <https://github.com/surmon-china>
 */

const { mongoose } = require('np-core/np-mongodb');
const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment');
const { PUBLISH_STATE } = require('np-core/np-constants');

// 公告模型
const announcementSchema = new mongoose.Schema({

  // 公告内容
  content: { type: String, required: true, validate: /\S+/ },

  // 公告发布状态 => 0 草稿，1 已发布
  state: { type: Number, default: PUBLISH_STATE.published },

  // 发布日期
  create_at: { type: Date, default: Date.now },

  // 最后修改日期
  update_at: { type: Date, default: Date.now },
});

// 翻页 + 自增 ID 插件配置
announcementSchema.plugin(mongoosePaginate);
announcementSchema.plugin(autoIncrement.plugin, {
  model: 'Announcement',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

// 时间更新
announcementSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});

// 公告模型
module.exports = mongoose.model('Announcement', announcementSchema);

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { Comment } from './comment.entity';

@Entity('article')
export class ArticleEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @Column('simple-array')
  tagList: string[];

  @ManyToOne(type => UserEntity, user => user.articles)
  author: UserEntity;

  @OneToMany(type => Comment, comment => comment.article, {eager: true})
  @JoinColumn()
  comments: Comment[];

  @Column({default: 0})
  favoriteCount: number;
}
