import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { CacheService } from '@app/processors/cache/cache.service';
import { Article } from '@app/modules/article/article.model';
import { Comment } from '@app/modules/comment/comment.model';
import { Tag } from '@app/modules/tag/tag.model';
export interface ITodayStatistic {
    tags: number | null;
    views: number | null;
    articles: number | null;
    comments: number | null;
}
export declare class StatisticService {
    private readonly cacheService;
    private readonly tagModel;
    private readonly articleModel;
    private readonly commentModel;
    private resultData;
    constructor(cacheService: CacheService, tagModel: MongooseModel<Tag>, articleModel: MongooseModel<Article>, commentModel: MongooseModel<Comment>);
    private getViewsCount;
    private getTagsCount;
    private getArticlesCount;
    private getCommentsCount;
    getStatistic(): Promise<ITodayStatistic>;
}
