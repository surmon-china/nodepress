import { Types } from 'mongoose';
import { CacheService } from '@app/processors/cache/cache.service';
import { SeoService } from '@app/processors/helper/helper.service.seo';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateOptions } from '@app/utils/paginate';
import { ArchiveService } from '@app/modules/archive/archive.service';
import { Article } from '@app/modules/article/article.model';
import { Tag } from './tag.model';
export declare class TagService {
    private readonly cacheService;
    private readonly archiveService;
    private readonly seoService;
    private readonly tagModel;
    private readonly articleModel;
    private tagListCache;
    constructor(cacheService: CacheService, archiveService: ArchiveService, seoService: SeoService, tagModel: MongooseModel<Tag>, articleModel: MongooseModel<Article>);
    private getListCacheTask;
    getListCache(): Promise<PaginateResult<Tag>>;
    updateListCache(): Promise<PaginateResult<Tag>>;
    getCounts(matchQuerys?: {}): Promise<{
        _id: Types.ObjectId;
        num_tutorial: number;
    }[]>;
    getList(querys: any, options: PaginateOptions, isAuthenticated: any): Promise<PaginateResult<Tag>>;
    create(newTag: Tag): Promise<Tag>;
    getDetailBySlug(slug: string): Promise<Tag>;
    update(tagID: Types.ObjectId, newTag: Tag): Promise<Tag>;
    delete(tagID: Types.ObjectId): Promise<Tag>;
    batchDelete(tagIDs: Types.ObjectId[]): Promise<import("mongodb").DeleteResult>;
}
