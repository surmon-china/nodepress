"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisStore = void 0;
const value_constant_1 = require("../../constants/value.constant");
const stringifyValue = (value) => {
    return (0, value_constant_1.isNil)(value) ? '' : JSON.stringify(value);
};
const parseValue = (value) => {
    return (0, value_constant_1.isNil)(value) ? value_constant_1.UNDEFINED : JSON.parse(value);
};
const createRedisStore = (redisClient, options) => {
    const getKeyName = (key) => {
        return (options === null || options === void 0 ? void 0 : options.namespace) ? `${options.namespace}:${key}` : key;
    };
    const get = async (key) => {
        const value = await redisClient.get(getKeyName(key));
        return parseValue(value);
    };
    const set = async (key, value, ttl) => {
        const _key = getKeyName(key);
        const _value = stringifyValue(value);
        const _ttl = (0, value_constant_1.isUndefined)(ttl) ? options === null || options === void 0 ? void 0 : options.defaultTTL : ttl;
        if (!(0, value_constant_1.isNil)(_ttl) && _ttl !== 0) {
            await redisClient.set(_key, _value, { expiration: { type: 'EX', value: _ttl } });
        }
        else {
            await redisClient.set(_key, _value);
        }
    };
    const mset = async (kvs, ttl) => {
        const _ttl = (0, value_constant_1.isUndefined)(ttl) ? options === null || options === void 0 ? void 0 : options.defaultTTL : ttl;
        if (!(0, value_constant_1.isNil)(_ttl) && _ttl !== 0) {
            const multi = redisClient.multi();
            for (const [key, value] of kvs) {
                multi.set(getKeyName(key), stringifyValue(value), { expiration: { type: 'EX', value: _ttl } });
            }
            await multi.exec();
        }
        else {
            await redisClient.mSet(kvs.map(([key, value]) => {
                return [getKeyName(key), stringifyValue(value)];
            }));
        }
    };
    const mget = (...keys) => {
        return redisClient.mGet(keys.map(getKeyName)).then((values) => {
            return values.map((value) => parseValue(value));
        });
    };
    const mdel = async (...keys) => {
        await redisClient.del(keys.map(getKeyName));
    };
    const del = async (key) => {
        const deleted = await redisClient.del(getKeyName(key));
        return deleted > 0;
    };
    const has = async (key) => {
        const count = await redisClient.exists(getKeyName(key));
        return count !== 0;
    };
    const ttl = (key) => redisClient.ttl(getKeyName(key));
    const keys = (pattern = getKeyName('*')) => redisClient.keys(pattern);
    const clear = async () => {
        await redisClient.del(await keys());
    };
    return {
        has,
        get,
        set,
        delete: del,
        mset,
        mget,
        mdel,
        ttl,
        keys,
        clear
    };
};
exports.createRedisStore = createRedisStore;
//# sourceMappingURL=redis.store.js.map