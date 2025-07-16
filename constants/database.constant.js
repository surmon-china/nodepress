"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG = exports.DB_MODEL_TOKEN_SUFFIX = exports.DB_CONNECTION_TOKEN = void 0;
exports.DB_CONNECTION_TOKEN = 'DBConnectionToken';
exports.DB_MODEL_TOKEN_SUFFIX = 'ModelToken';
exports.GENERAL_DB_AUTO_INCREMENT_ID_CONFIG = {
    field: 'id',
    startAt: 1,
    incrementBy: 1,
    trackerCollection: 'identitycounters',
    trackerModelName: 'identitycounter'
};
//# sourceMappingURL=database.constant.js.map