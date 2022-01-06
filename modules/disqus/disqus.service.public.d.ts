import { CommentService } from '@app/modules/comment/comment.service';
import { Comment, CreateCommentBase } from '@app/modules/comment/comment.model';
import { QueryVisitor } from '@app/decorators/query-params.decorator';
import { CacheService } from '@app/processors/cache/cache.service';
import { DisqusPrivateService } from './disqus.service.private';
export declare class DisqusPublicService {
    private readonly cacheService;
    private readonly commentService;
    private readonly disqusPrivateService;
    private disqus;
    constructor(cacheService: CacheService, commentService: CommentService, disqusPrivateService: DisqusPrivateService);
    private getUserInfoCacheKey;
    setUserInfoCache(uid: string | number, userInfo: any, ttl: number): import("@app/processors/cache/cache.service").CacheResult<void>;
    getUserInfoCache(uid: string | number): import("@app/processors/cache/cache.service").CacheResult<any>;
    deleteUserInfoCache(uid: string | number): import("@app/processors/cache/cache.service").CacheResult<void>;
    getAuthorizeURL(): string;
    getAccessToken(code: string): Promise<import("@app/utils/disqus").AccessToken>;
    refreshAccessToken(refreshToken: string): Promise<any>;
    getUserInfo(accessToken: string): Promise<any>;
    makeSureThreadDetail(postID: number): Promise<any>;
    makeSureThreadDetailCache(postID: number): Promise<any>;
    voteThread(params: any): Promise<{
        code: number;
        response: any;
    }>;
    votePost(params: any): Promise<{
        code: number;
        response: any;
    }>;
    getDisqusPostIDByCommentID(commentID: number): Promise<string | null>;
    createDisqusComment(payload: {
        comment: Comment;
        threadID: string;
        parentID: string | null;
        accessToken?: string;
    }): Promise<any>;
    createUniversalComment(comment: CreateCommentBase, visitor: QueryVisitor, accessToken?: string): Promise<Comment>;
    deleteDisqusComment(params: any): Promise<any>;
    deleteUniversalComment(commentID: number, accessToken: string): Promise<Comment>;
}
