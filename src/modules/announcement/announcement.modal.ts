
import { NAME } from './announcement.constants';
import { prop, plugin, pre, Typegoose } from 'typegoose';
import { IsString, IsInt, IsIn, IsDefined, IsNotEmpty } from 'class-validator';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongoose.transform';
import { EPublishState } from '@app/interfaces/state.interface';

@pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})

@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
  model: NAME,
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})

export class Announcement extends Typegoose {

  @IsNotEmpty({ message: '内容呢' })
  @IsString({ message: '这都是什么内容' })
  @prop({ required: true, validate: /\S+/ })
  content: string;

  @IsDefined()
  @IsIn([EPublishState.Draft, EPublishState.Published])
  @IsInt({ message: '状态要是数字' })
  @prop({ default: EPublishState.Published })
  state?: EPublishState;

  @prop({ default: Date.now })
  create_at?: Date;

  @prop({ default: Date.now })
  update_at?: Date;
}
