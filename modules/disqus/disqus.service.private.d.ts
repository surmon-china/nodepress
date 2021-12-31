/// <reference types="multer" />
import { ArticleService } from '@app/modules/article/article.service';
import { CommentService } from '@app/modules/comment/comment.service';
import { GeneralDisqusParams } from './disqus.model';
export declare class DisqusPrivateService {
    private readonly articleService;
    private readonly commentService;
    private disqus;
    constructor(articleService: ArticleService, commentService: CommentService);
    createThread(postID: number): Promise<any>;
    getThreads(params: GeneralDisqusParams): Promise<{
        code: number;
        response: any;
    }>;
    getPosts(params: GeneralDisqusParams): Promise<{
        code: number;
        response: any;
    }>;
    updateThread(params: any): Promise<{
        code: number;
        response: any;
    }>;
    updatePost(params: any): Promise<{
        code: number;
        response: any;
    }>;
    approvePost(params: any): Promise<{
        code: number;
        response: any;
    }>;
    exportXML(): Promise<string>;
    importXML(file: Express.Multer.File): Promise<{
        done: any[];
        fail: any[];
    }>;
}
