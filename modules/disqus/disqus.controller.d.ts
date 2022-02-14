/// <reference types="multer" />
import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { CommentBase } from '@app/modules/comment/comment.model';
import { AccessToken } from '@app/utils/disqus';
import { DisqusPublicService } from './disqus.service.public';
import { DisqusPrivateService } from './disqus.service.private';
import { CallbackCodeDTO, ThreadPostIdDTO, CommentIdDTO, GeneralDisqusParams } from './disqus.dto';
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
    oauthCallback(query: CallbackCodeDTO, response: any): Promise<void>;
    oauthLogout(token: AccessToken | null, response: any): void;
    getUserInfo(token: AccessToken | null): Promise<any>;
    getThread(query: ThreadPostIdDTO): Promise<any>;
    createComment({ visitor }: QueryParamsResult, token: AccessToken | null, comment: CommentBase): Promise<import("../../interfaces/mongoose.interface").MongooseDoc<import("@app/modules/comment/comment.model").Comment>>;
    deleteComment(payload: CommentIdDTO, token: AccessToken | null): Promise<import("../../interfaces/mongoose.interface").MongooseDoc<import("@app/modules/comment/comment.model").Comment>>;
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
