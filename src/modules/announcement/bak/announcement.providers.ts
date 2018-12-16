import { Connection } from 'mongoose';
import { AnnouncementSchema } from './announcement.schema';
import { DB_CONNECTION_TOKEN } from '@app/constants/system.constant';
import { NAME, MODEL_TOKEN } from '../announcement.constants';

export const AnnouncementProviders = [
  {
    provide: MODEL_TOKEN,
    useFactory: (connection: Connection) => connection.model(NAME, AnnouncementSchema),
    inject: [DB_CONNECTION_TOKEN],
  },
];