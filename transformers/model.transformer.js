"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectModel = exports.getProviderByTypegooseClass = exports.getModelToken = void 0;
const common_1 = require("@nestjs/common");
const typegoose_1 = require("@typegoose/typegoose");
const system_constant_1 = require("../constants/system.constant");
function getModelToken(modelName) {
    return modelName + system_constant_1.DB_MODEL_TOKEN_SUFFIX;
}
exports.getModelToken = getModelToken;
function getProviderByTypegooseClass(typegooseClass) {
    return {
        provide: getModelToken(typegooseClass.name),
        useFactory: (connection) => (0, typegoose_1.getModelForClass)(typegooseClass, { existingConnection: connection }),
        inject: [system_constant_1.DB_CONNECTION_TOKEN],
    };
}
exports.getProviderByTypegooseClass = getProviderByTypegooseClass;
function InjectModel(model) {
    return (0, common_1.Inject)(getModelToken(model.name));
}
exports.InjectModel = InjectModel;
//# sourceMappingURL=model.transformer.js.map