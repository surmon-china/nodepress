import { KeyValueModel } from '@app/models/key-value.model';
export declare const DEFAULT_OPTION: Option;
declare class AppMeta {
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
    statement: string;
    friend_links: KeyValueModel[];
    meta: AppMeta;
    blocklist: Blocklist;
    ad_config: string | null;
    update_at?: Date;
}
export declare const OptionProvider: import("@nestjs/common").Provider<any>;
export {};
