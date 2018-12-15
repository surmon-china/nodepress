
import { EPublishState } from '@app/interfaces/state.interface';

export class CreateAnnouncementDto {
  readonly content: string;
  readonly state: EPublishState;
  readonly create_at: Date;
  readonly update_at: Date;
}