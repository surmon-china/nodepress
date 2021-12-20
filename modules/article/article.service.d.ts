import { Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { SeoService } from '@app/processors/helper/helper.service.seo';
import { CacheService } from '@app/processors/cache/cache.service';
import { ArchiveService } from '@app/modules/archive/archive.service';
import { TagService } from '@app/modules/tag/tag.service';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateOptions } from '@app/utils/paginate';
import { SortType, PublicState, PublishState } from '@app/interfaces/biz.interface';
import { Article } from './article.model';
export declare const COMMON_USER_QUERY_PARAMS: Readonly<{
    state: PublishState;
    public: PublicState;
}>;
export declare class ArticleService {
    private readonly tagService;
    private readonly cacheService;
    private readonly archiveService;
    private readonly seoService;
    private readonly articleModel;
    private hotArticleListCache;
    constructor(tagService: TagService, cacheService: CacheService, archiveService: ArchiveService, seoService: SeoService, articleModel: MongooseModel<Article>);
    getUserHotListCache(): Promise<PaginateResult<Article>>;
    private getRelatedArticles;
    getHotSortOption(): {
        'meta.comments': SortType;
        'meta.likes': SortType;
    };
    getList(querys: any, options: PaginateOptions): Promise<PaginateResult<Article>>;
    getDetailByObjectId(articleID: Types.ObjectId): Promise<Article>;
    getDetailByNumberId(articleID: number): Promise<DocumentType<Article>>;
    getFullDetailForUser(articleID: number): Promise<Article>;
    create(newArticle: Article): Promise<Article>;
    update(articleID: Types.ObjectId, newArticle: Article): Promise<Article>;
    delete(articleID: Types.ObjectId): Promise<Article>;
    batchPatchState(articleIDs: Types.ObjectId[], state: PublishState): Promise<import("mongodb").UpdateResult>;
    batchDelete(articleIDs: Types.ObjectId[]): Promise<import("mongodb").DeleteResult>;
}
