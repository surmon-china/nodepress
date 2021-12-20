import { CacheService } from '@app/processors/cache/cache.service';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { Category } from '@app/modules/category/category.model';
import { Article } from '@app/modules/article/article.model';
import { Tag } from '@app/modules/tag/tag.model';
import * as APP_CONFIG from '@app/app.config';
export interface ArchiveData {
    meta: typeof APP_CONFIG.PROJECT;
    tags: Tag[];
    categories: Category[];
    articles: Article[];
}
export declare class ArchiveService {
    private readonly cacheService;
    private readonly tagModel;
    private readonly articleModel;
    private readonly categoryModel;
    private archiveCache;
    constructor(cacheService: CacheService, tagModel: MongooseModel<Tag>, articleModel: MongooseModel<Article>, categoryModel: MongooseModel<Category>);
    private getAllTags;
    private getAllCategories;
    private getAllArticles;
    private getArchiveData;
    getCache(): import("@app/processors/cache/cache.service").CacheResult<ArchiveData>;
    updateCache(): import("@app/processors/cache/cache.service").CacheResult<ArchiveData>;
}
