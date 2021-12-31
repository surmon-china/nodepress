/// <reference types="multer" />
import { CreateCommentBase } from '@app/modules/comment/comment.model';
import { AccessToken } from '@app/utils/disqus';
import { DisqusPublicService } from './disqus.service.public';
import { DisqusPrivateService } from './disqus.service.private';
import { CallbackCodePayload, ThreadPostIDPayload, CommentIDPayload, GeneralDisqusParams } from './disqus.model';
export declare class DisqusController {
    private readonly disqusPublicService;
    private readonly disqusPrivateService;
    constructor(disqusPublicService: DisqusPublicService, disqusPrivateService: DisqusPrivateService);
    getConfig(): {
        forum: string;
        admin_username: string;
        public_key: string;
        authorize_url: string;
    };
    oauthCallback(query: CallbackCodePayload, response: any): Promise<void>;
    oauthLogout(response: any): void;
    getUserInfo(token: AccessToken | null): Promise<any>;
    getThread(query: ThreadPostIDPayload): Promise<any>;
    createComment(comment: CreateCommentBase, { visitor }: {
        visitor: any;
    }, token: AccessToken | null): Promise<import("@app/modules/comment/comment.model").Comment>;
    deleteComment(payload: CommentIDPayload, token: AccessToken | null): Promise<import("@app/modules/comment/comment.model").Comment>;
    getThreads(query: GeneralDisqusParams): Promise<{
        code: number;
        response: any;
    }>;
    getPosts(query: GeneralDisqusParams): Promise<{
        code: number;
        response: any;
    }>;
    updatePost(body: any): Promise<{
        code: number;
        response: any;
    }>;
    updateThread(body: any): Promise<{
        code: number;
        response: any;
    }>;
    exportXML(response: any): Promise<void>;
    importXML(file: Express.Multer.File): Promise<{
        done: any[];
        fail: any[];
    }>;
}
