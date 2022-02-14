import { CacheService } from '@app/processors/cache/cache.service';
import { ArticleService } from '@app/modules/article/article.service';
import { CommentService } from '@app/modules/comment/comment.service';
import { TagService } from '@app/modules/tag/tag.service';
export interface Statistic {
    tags: number | null;
    articles: number | null;
    comments: number | null;
    totalViews: number | null;
    totalLikes: number | null;
    todayViews: number | null;
}
export declare class StatisticService {
    private readonly cacheService;
    private readonly articleService;
    private readonly commentService;
    private readonly tagService;
    private resultData;
    constructor(cacheService: CacheService, articleService: ArticleService, commentService: CommentService, tagService: TagService);
    private getTodayViewsCount;
    private getArticlesStatistic;
    private getArticlesCount;
    private getTagsCount;
    private getCommentsCount;
    getStatistic(publicOnly: boolean): Promise<Statistic>;
}
