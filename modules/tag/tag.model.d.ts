import { Types } from 'mongoose';
import { Extend } from '@app/models/extend.model';
export declare class Tag {
    id: number;
    name: string;
    slug: string;
    description: string;
    extends: Extend[];
    create_at?: Date;
    update_at?: Date;
    count?: number;
}
export declare class TagsPayload {
    tag_ids: Types.ObjectId[];
}
export declare const TagProvider: import("@nestjs/common").Provider<any>;
