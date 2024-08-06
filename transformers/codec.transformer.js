"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeBase64 = decodeBase64;
exports.decodeMD5 = decodeMD5;
const js_base64_1 = require("js-base64");
const crypto_1 = require("crypto");
function decodeBase64(value) {
    return value ? js_base64_1.Base64.decode(value) : value;
}
function decodeMD5(value) {
    return (0, crypto_1.createHash)('md5').update(value).digest('hex');
}
//# sourceMappingURL=codec.transformer.js.map