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
const createRedisStore = (redisClient, defaultTTL) => {
    const get = async (key) => {
        const value = await redisClient.get(key);
        return parseValue(value);
    };
    const set = async (key, value, ttl) => {
        const _value = stringifyValue(value);
        const _ttl = (0, value_constant_1.isUndefined)(ttl) ? defaultTTL : ttl;
        if (!(0, value_constant_1.isNil)(_ttl) && _ttl !== 0) {
            await redisClient.set(key, _value, { EX: _ttl });
        }
        else {
            await redisClient.set(key, _value);
        }
    };
    const mset = async (args, ttl) => {
        const _ttl = (0, value_constant_1.isUndefined)(ttl) ? defaultTTL : ttl;
        if (!(0, value_constant_1.isNil)(_ttl) && _ttl !== 0) {
            const multi = redisClient.multi();
            for (const [key, value] of args) {
                multi.set(key, stringifyValue(value), { EX: _ttl });
            }
            await multi.exec();
        }
        else {
            await redisClient.mSet(args.map(([key, value]) => {
                return [key, stringifyValue(value)];
            }));
        }
    };
    const mget = (...args) => {
        return redisClient.mGet(args).then((values) => {
            return values.map((value) => parseValue(value));
        });
    };
    const mdel = async (...args) => {
        await redisClient.del(args);
    };
    const del = async (key) => {
        await redisClient.del(key);
    };
    const reset = async () => {
        await redisClient.flushDb();
    };
    const ttl = (key) => redisClient.pTTL(key);
    const keys = (pattern = '*') => redisClient.keys(pattern);
    return {
        get,
        set,
        mset,
        mget,
        mdel,
        del,
        reset,
        ttl,
        keys
    };
};
exports.createRedisStore = createRedisStore;
//# sourceMappingURL=redis.store.js.map