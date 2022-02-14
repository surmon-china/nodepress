import { Author } from '@app/modules/comment/comment.model';
export declare class VoteAuthorDTO {
    author?: Author;
}
export declare class CommentVoteDTO extends VoteAuthorDTO {
    comment_id: number;
    vote: number;
}
export declare class PageVoteDTO extends VoteAuthorDTO {
    article_id: number;
    vote: number;
}
