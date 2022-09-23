import { PaginateOptionDTO } from '@app/models/paginate.model';
import { Author } from '@app/modules/comment/comment.model';
export declare class VotePaginateQueryDTO extends PaginateOptionDTO {
    target_type?: number;
    target_id?: number;
    vote_type?: number;
    author_type?: number;
}
export declare class VotesDTO {
    vote_ids: string[];
}
export declare class VoteAuthorDTO {
    author?: Author;
}
export declare class CommentVoteDTO extends VoteAuthorDTO {
    comment_id: number;
    vote: number;
}
export declare class PostVoteDTO extends VoteAuthorDTO {
    post_id: number;
    vote: number;
}
