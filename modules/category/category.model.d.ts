import { Types } from 'mongoose';
import { ExtendModel } from '@app/models/extend.model';
export declare class Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    pid: Types.ObjectId;
    create_at?: Date;
    update_at?: Date;
    extends: ExtendModel[];
    articles_count?: number;
}
export declare const CategoryProvider: import("@nestjs/common").Provider<any>;
