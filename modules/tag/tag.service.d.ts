import { CacheService } from '@app/processors/cache/cache.service';
import { SeoService } from '@app/processors/helper/helper.service.seo';
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate';
import { ArchiveService } from '@app/modules/archive/archive.service';
import { Article } from '@app/modules/article/article.model';
import { Tag } from './tag.model';
export declare class TagService {
    private readonly seoService;
    private readonly cacheService;
    private readonly archiveService;
    private readonly tagModel;
    private readonly articleModel;
    private allTagsCache;
    constructor(seoService: SeoService, cacheService: CacheService, archiveService: ArchiveService, tagModel: MongooseModel<Tag>, articleModel: MongooseModel<Article>);
    private aggregate;
    getAllTags(): Promise<Array<Tag>>;
    getAllTagsCache(): Promise<Array<Tag>>;
    updateAllTagsCache(): Promise<Array<Tag>>;
    paginater(querys: PaginateQuery<Tag>, options: PaginateOptions, publicOnly: boolean): Promise<PaginateResult<Tag>>;
    getDetailBySlug(slug: string): Promise<MongooseDoc<Tag>>;
    create(newTag: Tag): Promise<MongooseDoc<Tag>>;
    update(tagID: MongooseID, newTag: Tag): Promise<MongooseDoc<Tag>>;
    delete(tagID: MongooseID): Promise<MongooseDoc<Tag>>;
    batchDelete(tagIDs: MongooseID[]): Promise<import("mongodb").DeleteResult>;
    getTotalCount(): Promise<number>;
}
