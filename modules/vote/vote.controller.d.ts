import { PaginateResult } from '@app/utils/paginate';
import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { IPService } from '@app/processors/helper/helper.service.ip';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { OptionService } from '@app/modules/option/option.service';
import { ArticleService } from '@app/modules/article/article.service';
import { CommentService } from '@app/modules/comment/comment.service';
import { DisqusPublicService } from '@app/modules/disqus/disqus.service.public';
import { AccessToken } from '@app/utils/disqus';
import { VoteAuthorDTO, CommentVoteDTO, PageVoteDTO, VotePaginateQueryDTO, VotesDTO } from './vote.dto';
import { Vote } from './vote.model';
import { VoteService } from './vote.service';
export declare class VoteController {
    private readonly ipService;
    private readonly emailService;
    private readonly disqusPublicService;
    private readonly commentService;
    private readonly articleService;
    private readonly optionService;
    private readonly voteService;
    constructor(ipService: IPService, emailService: EmailService, disqusPublicService: DisqusPublicService, commentService: CommentService, articleService: ArticleService, optionService: OptionService, voteService: VoteService);
    private queryIPLocation;
    private getTargetTitle;
    private getVoteAuthor;
    private getAuthorString;
    private emailToTargetVoteMessage;
    voteDisqusThread(articleID: number, vote: number, token?: string): Promise<{
        code: number;
        response: any;
    }>;
    getVotes(query: VotePaginateQueryDTO): Promise<PaginateResult<Vote>>;
    deleteVotes(body: VotesDTO): Promise<import("mongodb").DeleteResult>;
    likeSite(voteBody: VoteAuthorDTO, token: AccessToken | null, { visitor }: QueryParamsResult): Promise<number>;
    voteArticle(voteBody: PageVoteDTO, token: AccessToken | null, { visitor }: QueryParamsResult): Promise<number>;
    voteComment(voteBody: CommentVoteDTO, token: AccessToken | null, { visitor }: QueryParamsResult): Promise<{
        likes: number;
        dislikes: number;
    }>;
}
