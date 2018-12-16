
import { IsString, IsInt } from 'class-validator';
import { EPublishState } from '@app/interfaces/state.interface';

export class CreateAnnouncementDto {
  @IsString()
  readonly content: string;

  @IsInt({ message: '没有状态唉' })
  readonly state?: EPublishState;
}