"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSService = exports.AWSServerSideEncryption = exports.AWSStorageClass = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const APP_CONFIG = __importStar(require("../../app.config"));
var client_s3_2 = require("@aws-sdk/client-s3");
Object.defineProperty(exports, "AWSStorageClass", { enumerable: true, get: function () { return client_s3_2.StorageClass; } });
Object.defineProperty(exports, "AWSServerSideEncryption", { enumerable: true, get: function () { return client_s3_2.ServerSideEncryption; } });
let AWSService = exports.AWSService = class AWSService {
    createClient(region) {
        return new client_s3_1.S3Client({
            region,
            credentials: {
                accessKeyId: APP_CONFIG.AWS.accessKeyId,
                secretAccessKey: APP_CONFIG.AWS.secretAccessKey
            }
        });
    }
    getObjectAttributes(payload) {
        const s3Client = this.createClient(payload.region);
        const command = new client_s3_1.GetObjectAttributesCommand({
            Bucket: payload.bucket,
            Key: payload.key,
            ObjectAttributes: Object.values(client_s3_1.ObjectAttributes)
        });
        return s3Client.send(command);
    }
    uploadFile(payload) {
        var _a;
        const { region, bucket, name: key } = payload;
        const s3Client = this.createClient(region);
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: payload.file,
            ContentType: payload.fileContentType,
            StorageClass: (_a = payload.classType) !== null && _a !== void 0 ? _a : 'STANDARD',
            ServerSideEncryption: payload.encryption
        });
        return s3Client.send(command).then(() => {
            return this.getObjectAttributes({ region, bucket, key }).then((attributes) => {
                return {
                    key,
                    url: `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
                    eTag: attributes.ETag,
                    size: attributes.ObjectSize
                };
            });
        });
    }
};
exports.AWSService = AWSService = __decorate([
    (0, common_1.Injectable)()
], AWSService);
//# sourceMappingURL=helper.service.aws.js.map