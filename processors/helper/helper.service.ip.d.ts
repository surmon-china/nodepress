import { HttpService } from '@nestjs/axios';
export declare type IP = string;
export interface IPLocation {
    country: string;
    country_code: string;
    region: string;
    region_code: string;
    city: string;
    zip: string;
}
export declare class IPService {
    private readonly httpService;
    constructor(httpService: HttpService);
    private queryLocationByIPAPI;
    private queryLocationByAPICo;
    queryLocation(ip: IP): Promise<IPLocation | null>;
}
