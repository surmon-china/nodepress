import { HttpService } from '@nestjs/axios';
import { GoogleService } from './helper.service.google';
export declare type SeoURL = string;
export declare type ActionURL = SeoURL | SeoURL[];
export declare enum SeoAction {
    Push = "push",
    Update = "update",
    Delete = "delete"
}
export declare class SeoService {
    private readonly httpService;
    private readonly googleService;
    constructor(httpService: HttpService, googleService: GoogleService);
    private pingBaidu;
    private pingGoogle;
    private humanizedUrl;
    push(url: ActionURL): void;
    update(url: ActionURL): void;
    delete(url: ActionURL): void;
}
