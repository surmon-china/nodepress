import { TagService } from '@app/modules/tag/tag.service';
import { CategoryService } from '@app/modules/category/category.service';
import { PaginateResult } from '@app/utils/paginate';
import { Article, ArticlesPayload, ArticlesStatePayload } from './article.model';
import { ArticleService } from './article.service';
export declare class ArticleController {
    private readonly tagService;
    private readonly categoryService;
    private readonly articleService;
    constructor(tagService: TagService, categoryService: CategoryService, articleService: ArticleService);
    getArticles({ querys, options, origin, isAuthenticated }: {
        querys: any;
        options: any;
        origin: any;
        isAuthenticated: any;
    }): Promise<PaginateResult<Article>>;
    getArticle({ params, isAuthenticated }: {
        params: any;
        isAuthenticated: any;
    }): Promise<Article>;
    createArticle(article: Article): Promise<Article>;
    putArticle({ params }: {
        params: any;
    }, article: Article): Promise<Article>;
    delArticle({ params }: {
        params: any;
    }): Promise<Article>;
    patchArticles(body: ArticlesStatePayload): Promise<import("mongodb").UpdateResult>;
    delArticles(body: ArticlesPayload): Promise<import("mongodb").DeleteResult>;
}
