import { OptionService } from '@app/modules/option/option.service';
import { ArticleService } from '@app/modules/article/article.service';
import { CommentService } from '@app/modules/comment/comment.service';
export declare class LikeService {
    private readonly optionService;
    private readonly articleService;
    private readonly commentService;
    constructor(optionService: OptionService, articleService: ArticleService, commentService: CommentService);
    likeSite(): Promise<boolean>;
    likeComment(commentID: number): Promise<boolean>;
    likeArticle(articleID: number): Promise<boolean>;
}
