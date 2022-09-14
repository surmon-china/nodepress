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
    STATIC_URL: string;
};
export declare const PROJECT: {
    name: any;
    version: any;
    author: any;
    homepage: any;
    documentation: any;
    repository: any;
};
export declare const CROSS_DOMAIN: {
    allowedOrigins: string[];
    allowedReferer: string;
};
export declare const MONGO_DB: {
    uri: string;
};
export declare const REDIS: {
    host: string;
    port: string | number;
    username: string | null;
    password: string | null;
};
export declare const AUTH: {
    expiresIn: string | number;
    data: string | {
        user: string;
    };
    jwtSecret: string;
    defaultPassword: string;
};
export declare const EMAIL: {
    port: number;
    host: string;
    account: string;
    password: string;
    from: string;
};
export declare const DISQUS: {
    adminAccessToken: string;
    adminUsername: string;
    forum: string;
    publicKey: string;
    secretKey: string;
};
export declare const AKISMET: {
    key: string;
    blog: string;
};
export declare const BAIDU_INDEXED: {
    site: string;
    token: string;
};
export declare const GOOGLE: {
    jwtServiceAccountCredentials: any;
};
export declare const AWS: {
    accessKeyId: string;
    secretAccessKey: string;
    s3StaticRegion: string;
    s3StaticBucket: string;
};
export declare const DB_BACKUP: {
    s3Region: string;
    s3Bucket: string;
    password: string;
};
