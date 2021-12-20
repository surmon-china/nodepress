declare class Meta {
    likes: number;
}
export declare class Blacklist {
    ips: string[];
    mails: string[];
    keywords: string[];
}
export declare class Option {
    title: string;
    sub_title: string;
    keywords: string[];
    description: string;
    site_url: string;
    site_email: string;
    site_icp: string;
    blacklist: Blacklist;
    meta: Meta;
    ad_config: string;
    update_at?: Date;
}
export declare const OptionProvider: import("@nestjs/common").Provider<any>;
export {};
