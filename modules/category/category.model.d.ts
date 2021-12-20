import { Types } from 'mongoose';
import { Extend } from '@app/models/extend.model';
export declare class Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    pid: Types.ObjectId;
    create_at?: Date;
    update_at?: Date;
    extends: Extend[];
    count?: number;
}
export declare class CategoriesPayload {
    category_ids: Types.ObjectId[];
}
export declare const CategoryProvider: import("@nestjs/common").Provider<any>;
