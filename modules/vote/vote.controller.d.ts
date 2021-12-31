import { OptionService } from '@app/modules/option/option.service';
import { ArticleService } from '@app/modules/article/article.service';
import { CommentService } from '@app/modules/comment/comment.service';
import { DisqusPublicService } from '@app/modules/disqus/disqus.service.public';
import { AccessToken } from '@app/utils/disqus';
export declare class CommentVotePayload {
    comment_id: number;
    vote: number;
}
export declare class ArticleVotePayload {
    article_id: number;
    vote: number;
}
export declare class VoteController {
    private readonly disqusPublicService;
    private readonly commentService;
    private readonly articleService;
    private readonly optionService;
    constructor(disqusPublicService: DisqusPublicService, commentService: CommentService, articleService: ArticleService, optionService: OptionService);
    voteDisqusThread(articleID: number, vote: number, token?: string): Promise<{
        code: number;
        response: any;
    }>;
    likeSite(token: AccessToken | null): Promise<number>;
    voteArticle(voteBody: ArticleVotePayload, token: AccessToken | null): Promise<number>;
    voteComment(voteBody: CommentVotePayload, token: AccessToken | null): Promise<{
        likes: number;
        dislikes: number;
    }>;
}
