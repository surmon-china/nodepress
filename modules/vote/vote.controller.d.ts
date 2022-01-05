import { IPService } from '@app/processors/helper/helper.service.ip';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { OptionService } from '@app/modules/option/option.service';
import { ArticleService } from '@app/modules/article/article.service';
import { CommentService } from '@app/modules/comment/comment.service';
import { Author } from '@app/modules/comment/comment.model';
import { DisqusPublicService } from '@app/modules/disqus/disqus.service.public';
import { AccessToken } from '@app/utils/disqus';
export declare class VoteAuthorPayload {
    author?: Author;
}
export declare class CommentVotePayload extends VoteAuthorPayload {
    comment_id: number;
    vote: number;
}
export declare class PageVotePayload extends VoteAuthorPayload {
    article_id: number;
    vote: number;
}
export declare class VoteController {
    private readonly ipService;
    private readonly emailService;
    private readonly disqusPublicService;
    private readonly commentService;
    private readonly articleService;
    private readonly optionService;
    constructor(ipService: IPService, emailService: EmailService, disqusPublicService: DisqusPublicService, commentService: CommentService, articleService: ArticleService, optionService: OptionService);
    private getAuthor;
    private getTargetTitle;
    private emailToTargetVoteMessage;
    voteDisqusThread(articleID: number, vote: number, token?: string): Promise<{
        code: number;
        response: any;
    }>;
    likeSite(voteBody: VoteAuthorPayload, token: AccessToken | null, { visitor }: {
        visitor: any;
    }): Promise<number>;
    voteArticle(voteBody: PageVotePayload, token: AccessToken | null, { visitor }: {
        visitor: any;
    }): Promise<number>;
    voteComment(voteBody: CommentVotePayload, token: AccessToken | null, { visitor }: {
        visitor: any;
    }): Promise<{
        likes: number;
        dislikes: number;
    }>;
}
