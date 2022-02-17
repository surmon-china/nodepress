import { SeoService } from '@app/processors/helper/helper.service.seo';
import { CacheService } from '@app/processors/cache/cache.service';
import { ArchiveService } from '@app/modules/archive/archive.service';
import { TagService } from '@app/modules/tag/tag.service';
import { PublishState } from '@app/interfaces/biz.interface';
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate';
import { Article } from './article.model';
export declare class ArticleService {
    private readonly seoService;
    private readonly tagService;
    private readonly cacheService;
    private readonly archiveService;
    private readonly articleModel;
    private hottestArticlesCache;
    constructor(seoService: SeoService, tagService: TagService, cacheService: CacheService, archiveService: ArchiveService, articleModel: MongooseModel<Article>);
    getHottestArticles(count: number): Promise<Array<Article>>;
    getHottestArticlesCache(): Promise<Array<Article>>;
    getNearArticles(articleID: number, type: 'later' | 'early', count: number): Promise<Article[]>;
    getRelatedArticles(article: Article, count: number): Promise<Article[]>;
    paginater(query: PaginateQuery<Article>, options: PaginateOptions): Promise<PaginateResult<Article>>;
    getList(articleIDs: number[]): Promise<Array<Article>>;
    getDetailByObjectID(articleID: MongooseID): Promise<MongooseDoc<Article>>;
    getDetailByNumberIDOrSlug({ idOrSlug, publicOnly, populate, }: {
        idOrSlug: number | string;
        publicOnly?: boolean;
        populate?: boolean;
    }): Promise<MongooseDoc<Article>>;
    getFullDetailForGuest(target: number | string): Promise<Article>;
    incrementLikes(articleID: number): Promise<number>;
    create(newArticle: Article): Promise<MongooseDoc<Article>>;
    update(articleID: MongooseID, newArticle: Article): Promise<MongooseDoc<Article>>;
    delete(articleID: MongooseID): Promise<MongooseDoc<Article>>;
    batchPatchState(articleIDs: MongooseID[], state: PublishState): Promise<import("mongodb").UpdateResult>;
    batchDelete(articleIDs: MongooseID[]): Promise<import("mongodb").DeleteResult>;
    getTotalCount(publicOnly: boolean): Promise<number>;
    getCalendar(publicOnly: boolean, timezone?: string): Promise<{
        date: string;
        count: number;
    }[]>;
    getMetaStatistic(): Promise<{
        totalViews: number;
        totalLikes: number;
    }>;
    isCommentableArticle(articleID: number): Promise<boolean>;
    updateMetaComments(articleID: number, commentCount: number): Promise<import("mongodb").UpdateResult>;
}
