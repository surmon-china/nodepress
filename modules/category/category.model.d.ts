import { Types } from 'mongoose';
import { KeyValueModel } from '@app/models/key-value.model';
export declare class Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    pid: Types.ObjectId;
    create_at?: Date;
    update_at?: Date;
    extends: KeyValueModel[];
    articles_count?: number;
}
export declare const CategoryProvider: import("@nestjs/common").Provider<any>;
