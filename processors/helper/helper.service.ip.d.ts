import { HttpService } from '@nestjs/axios';
export declare type IP = string;
export interface IPLocation {
    city: string;
    country: string;
}
export declare class IPService {
    private readonly httpService;
    constructor(httpService: HttpService);
    private queryIPByAliyun;
    private queryIPByJUHE;
    query(ip: IP): Promise<IPLocation>;
}
