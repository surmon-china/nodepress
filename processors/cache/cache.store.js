"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const createRedisStore = (options) => {
    const client = (0, redis_1.createClient)(options.redisOptions);
    const set = async (key, value, options = {}) => {
        const { ttl } = options;
        const _value = value ? JSON.stringify(value) : '';
        if (ttl) {
            const _ttl = typeof ttl === 'function' ? ttl(value) : ttl;
            await client.setEx(key, _ttl, _value);
        }
        else {
            await client.set(key, _value);
        }
    };
    const get = async (key) => {
        const value = await client.get(key);
        return value ? JSON.parse(value) : value;
    };
    const del = async (key) => {
        await client.del(key);
    };
    const todo = {
        async mget(...args) {
            return [];
        },
        async mset(args, ttl) { },
        async mdel(...args) { },
        async reset() { },
        async keys(pattern) {
            return [];
        },
        async ttl(key) {
            return 0;
        },
    };
    return Object.assign(Object.assign({ client }, todo), { set, get, del });
};
const redisStoreFactory = {
    create: createRedisStore,
};
exports.default = redisStoreFactory;
//# sourceMappingURL=cache.store.js.map