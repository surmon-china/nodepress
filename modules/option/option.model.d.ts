export declare const DEFAULT_OPTION: Readonly<Option>;
declare class Meta {
    likes: number;
}
export declare class Blocklist {
    ips: string[];
    mails: string[];
    keywords: string[];
}
export declare class Option {
    title: string;
    sub_title: string;
    description: string;
    keywords: string[];
    site_url: string;
    site_email: string;
    meta: Meta;
    blocklist: Blocklist;
    ad_config: string;
    update_at?: Date;
}
export declare const OptionProvider: import("@nestjs/common").Provider<any>;
export {};
