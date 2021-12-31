"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disqus = exports.DISQUS_PUBKEY = void 0;
const axios_1 = __importDefault(require("axios"));
const AUTHORIZE_URL = 'https://disqus.com/api/oauth/2.0/authorize';
const ACCESS_TOKEN_URL = 'https://disqus.com/api/oauth/2.0/access_token/';
const getApiURL = (resource) => `https://disqus.com/api/3.0/${resource}.json`;
const normalizeAxiosError = (error) => {
    var _a, _b, _c;
    return ((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.response) || ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) || (error === null || error === void 0 ? void 0 : error.toJSON()) || (error === null || error === void 0 ? void 0 : error.message) || error;
};
const resourcesRequiringPost = [
    'blacklists/add',
    'blacklists/remove',
    'categories/create',
    'exports/exportForum',
    'forums/addModerator',
    'forums/create',
    'forums/removeModerator',
    'posts/approve',
    'posts/create',
    'posts/highlight',
    'posts/remove',
    'posts/report',
    'posts/restore',
    'posts/spam',
    'posts/unhighlight',
    'posts/update',
    'posts/vote',
    'reactions/remove',
    'reactions/restore',
    'threads/close',
    'threads/create',
    'threads/open',
    'threads/remove',
    'threads/restore',
    'threads/subscribe',
    'threads/unsubscribe',
    'threads/update',
    'threads/vote',
    'users/checkUsername',
    'users/follow',
    'users/unfollow',
    'whitelists/add',
    'whitelists/remove',
];
exports.DISQUS_PUBKEY = `E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F`;
class Disqus {
    constructor(config) {
        this.config = config;
    }
    request(resource, params = {}, usePublic = false) {
        const api = getApiURL(resource);
        const queryParams = Object.assign({}, params);
        if (usePublic) {
            queryParams.api_key = exports.DISQUS_PUBKEY;
        }
        else {
            queryParams.api_key = this.config.apiKey;
            queryParams.api_secret = this.config.apiSecret;
        }
        const requester = resourcesRequiringPost.includes(resource)
            ? axios_1.default.post(api, null, { params: queryParams })
            : axios_1.default.get(api, { params: queryParams });
        return requester
            .then((response) => {
            return response.data.code !== 0 ? Promise.reject(response.data) : Promise.resolve(response.data);
        })
            .catch((error) => {
            var _a, _b;
            return ((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.response)
                ? Promise.reject(`[code=${error.response.data.code}] ${error.response.data.response}`)
                : Promise.reject(normalizeAxiosError(error));
        });
    }
    getAuthorizeURL(type = 'code', scope, uri) {
        const url = new URL(AUTHORIZE_URL);
        url.searchParams.set('client_id', this.config.apiKey);
        url.searchParams.set('response_type', type);
        url.searchParams.set('scope', scope);
        url.searchParams.set('redirect_uri', uri);
        return url.href;
    }
    getOAuthAccessToken(code, uri) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const formData = new URLSearchParams();
        formData.append('code', code);
        formData.append('grant_type', 'authorization_code');
        formData.append('client_id', this.config.apiKey);
        formData.append('client_secret', this.config.apiSecret);
        formData.append('redirect_uri', uri);
        return axios_1.default
            .post(ACCESS_TOKEN_URL, formData.toString(), config)
            .then((response) => response.data)
            .catch((error) => Promise.reject(normalizeAxiosError(error)));
    }
    refreshOAuthAccessToken(refreshtoken) {
        const url = new URL(ACCESS_TOKEN_URL);
        url.searchParams.set('grant_type', 'refresh_token');
        url.searchParams.set('refresh_token', refreshtoken);
        url.searchParams.set('client_id', this.config.apiKey);
        url.searchParams.set('client_secret', this.config.apiSecret);
        return axios_1.default
            .get(url.href)
            .then((response) => response.data)
            .catch((error) => Promise.reject(normalizeAxiosError(error)));
    }
}
exports.Disqus = Disqus;
//# sourceMappingURL=disqus.js.map