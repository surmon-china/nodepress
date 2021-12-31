import { Types } from 'mongoose';
import { Ref } from '@typegoose/typegoose';
import { PublishState, PublicState, OriginState } from '@app/interfaces/biz.interface';
import { Category } from '@app/modules/category/category.model';
import { Extend } from '@app/models/extend.model';
import { Tag } from '@app/modules/tag/tag.model';
export declare function getDefaultMeta(): Meta;
export declare class Meta {
    likes: number;
    views: number;
    comments: number;
}
export declare class Article {
    id: number;
    slug: string;
    title: string;
    content: string;
    description: string;
    keywords: string[];
    thumb: string;
    password: string;
    disabled_comment: boolean;
    state: PublishState;
    public: PublicState;
    origin: OriginState;
    category: Ref<Category>[];
    tag: Ref<Tag>[];
    meta: Meta;
    create_at?: Date;
    update_at?: Date;
    extends: Extend[];
    related?: Article[];
}
export declare class ArticlesPayload {
    article_ids: Types.ObjectId[];
}
export declare class ArticlesStatePayload extends ArticlesPayload {
    state: PublishState;
}
export declare const ArticleProvider: import("@nestjs/common").Provider<any>;
