import { Ref } from '@typegoose/typegoose';
import { Language, SortType, PublishState, PublicState, OriginState } from '@app/constants/biz.constant';
import { Category } from '@app/modules/category/category.model';
import { KeyValueModel } from '@app/models/key-value.model';
import { Tag } from '@app/modules/tag/tag.model';
export declare const ARTICLE_LANGUAGES: readonly [Language.English, Language.Chinese];
export declare const ARTICLE_PUBLISH_STATES: readonly [PublishState.Draft, PublishState.Published, PublishState.Recycle];
export declare const ARTICLE_PUBLIC_STATES: readonly [PublicState.Public, PublicState.Secret, PublicState.Reserve];
export declare const ARTICLE_ORIGIN_STATES: readonly [OriginState.Original, OriginState.Reprint, OriginState.Hybrid];
export declare const ARTICLE_FULL_QUERY_REF_POPULATE: string[];
export declare const ARTICLE_LIST_QUERY_PROJECTION: {
    content: boolean;
};
export declare const ARTICLE_LIST_QUERY_GUEST_FILTER: Readonly<{
    state: PublishState.Published;
    public: PublicState.Public;
}>;
export declare const ARTICLE_HOTTEST_SORT_PARAMS: Readonly<{
    'meta.comments': SortType.Desc;
    'meta.likes': SortType.Desc;
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
    thumb: string | null;
    state: PublishState;
    public: PublicState;
    origin: OriginState;
    category: Ref<Category>[];
    tag: Ref<Tag>[];
    lang: Language;
    disabled_comment: boolean;
    meta: ArticleMeta;
    create_at?: Date;
    update_at?: Date;
    extends: KeyValueModel[];
}
export declare const ArticleProvider: import("@nestjs/common").Provider<any>;
