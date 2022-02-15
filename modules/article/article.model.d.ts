import { Ref } from '@typegoose/typegoose';
import { SortType, PublishState, PublicState, OriginState } from '@app/interfaces/biz.interface';
import { Category } from '@app/modules/category/category.model';
import { ExtendModel } from '@app/models/extend.model';
import { Tag } from '@app/modules/tag/tag.model';
export declare const ARTICLE_PUBLISH_STATES: readonly [PublishState.Draft, PublishState.Published, PublishState.Recycle];
export declare const ARTICLE_PUBLIC_STATES: readonly [PublicState.Public, PublicState.Secret, PublicState.Reserve];
export declare const ARTICLE_ORIGIN_STATES: readonly [OriginState.Original, OriginState.Reprint, OriginState.Hybrid];
export declare const ARTICLE_FULL_QUERY_REF_POPULATE: string[];
export declare const ARTICLE_LIST_QUERY_PROJECTION: {
    content: boolean;
};
export declare const ARTICLE_LIST_QUERY_GUEST_FILTER: Readonly<{
    state: PublishState;
    public: PublicState;
}>;
export declare const ARTICLE_HOTTEST_SORT_PARAMS: Readonly<{
    'meta.comments': SortType;
    'meta.likes': SortType;
}>;
export declare class ArticleMeta {
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
    disabled_comment: boolean;
    state: PublishState;
    public: PublicState;
    origin: OriginState;
    category: Ref<Category>[];
    tag: Ref<Tag>[];
    meta: ArticleMeta;
    create_at?: Date;
    update_at?: Date;
    extends: ExtendModel[];
}
export declare const ArticleProvider: import("@nestjs/common").Provider<any>;
