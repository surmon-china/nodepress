import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { TagService } from '@app/modules/tag/tag.service';
import { CategoryService } from '@app/modules/category/category.service';
import { PaginateResult } from '@app/utils/paginate';
import { ArticlePaginateQueryDTO, ArticleListQueryDTO, ArticleCalendarQueryDTO, ArticleIDsDTO, ArticlesStateDTO } from './article.dto';
import { ArticleService } from './article.service';
import { Article } from './article.model';
export declare class ArticleController {
    private readonly tagService;
    private readonly categoryService;
    private readonly articleService;
    constructor(tagService: TagService, categoryService: CategoryService, articleService: ArticleService);
    getArticles(query: ArticlePaginateQueryDTO): Promise<PaginateResult<Article>>;
    getHottestArticles(query: ArticleListQueryDTO): Promise<Array<Article>>;
    getArticleCalendar(query: ArticleCalendarQueryDTO, { isUnauthenticated }: QueryParamsResult): Promise<{
        day: string;
        count: number;
    }[]>;
    getArticleContext({ params }: QueryParamsResult): Promise<{
        prev_article: Article;
        next_article: Article;
        related_articles: Article[];
    }>;
    getArticle({ params, isUnauthenticated }: QueryParamsResult): Promise<Article>;
    createArticle(article: Article): Promise<Article>;
    putArticle({ params }: QueryParamsResult, article: Article): Promise<Article>;
    delArticle({ params }: QueryParamsResult): Promise<Article>;
    patchArticles(body: ArticlesStateDTO): Promise<import("mongodb").UpdateResult>;
    delArticles(body: ArticleIDsDTO): Promise<import("mongodb").DeleteResult>;
}
