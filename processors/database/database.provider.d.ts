import mongoose from 'mongoose';
import { EmailService } from '@app/processors/helper/helper.service.email';
export declare const databaseProvider: {
    inject: (typeof EmailService)[];
    provide: string;
    useFactory: (emailService: EmailService) => Promise<typeof mongoose>;
};
