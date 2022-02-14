import { ExtendModel } from '@app/models/extend.model';
export declare class Tag {
    id: number;
    name: string;
    slug: string;
    description: string;
    create_at?: Date;
    update_at?: Date;
    extends: ExtendModel[];
    articles_count?: number;
}
export declare const TagProvider: import("@nestjs/common").Provider<any>;
