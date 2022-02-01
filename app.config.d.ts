export declare const APP: {
    PORT: number;
    ROOT_PATH: string;
    DEFAULT_CACHE_TTL: number;
    MASTER: string;
    NAME: string;
    URL: string;
    ADMIN_EMAIL: string;
    FE_NAME: string;
    FE_URL: string;
};
export declare const PROJECT: {
    name: any;
    version: any;
    author: any;
    homepage: any;
    issues: any;
};
export declare const CROSS_DOMAIN: {
    allowedOrigins: string[];
    allowedReferer: string;
};
export declare const MONGO_DB: {
    uri: string;
};
export declare const REDIS: {
    host: unknown;
    port: unknown;
    username: string;
    password: string;
};
export declare const AUTH: {
    expiresIn: unknown;
    data: unknown;
    jwtTokenSecret: unknown;
    defaultPassword: unknown;
};
export declare const EMAIL: {
    account: unknown;
    password: unknown;
};
export declare const DISQUS: {
    adminAccessToken: string;
    adminUsername: string;
    forum: string;
    publicKey: string;
    secretKey: string;
};
export declare const AKISMET: {
    key: unknown;
    blog: unknown;
};
export declare const BAIDU_INDEXED: {
    site: unknown;
    token: unknown;
};
export declare const GOOGLE: {
    serverAccountFilePath: string;
};
export declare const ALIYUN_CLOUD_STORAGE: {
    accessKey: string;
    secretKey: string;
    aliyunAcsARN: string;
};
export declare const DB_BACKUP: {
    bucket: string;
    region: string;
};
