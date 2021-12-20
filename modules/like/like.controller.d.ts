import { LikeService } from './like.service';
export declare class LikeComment {
    comment_id: number;
}
export declare class LikeArticle {
    article_id: number;
}
export declare class LikeController {
    private readonly likeService;
    constructor(likeService: LikeService);
    likeSite(): Promise<boolean>;
    likeComment(likeComment: LikeComment): Promise<boolean>;
    likeArticle(likeArticle: LikeArticle): Promise<boolean>;
}
