"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelToken = getModelToken;
exports.getProviderByTypegooseClass = getProviderByTypegooseClass;
exports.InjectModel = InjectModel;
const common_1 = require("@nestjs/common");
const typegoose_1 = require("@typegoose/typegoose");
const system_constant_1 = require("../constants/system.constant");
function getModelToken(modelName) {
    return modelName + system_constant_1.DB_MODEL_TOKEN_SUFFIX;
}
function getProviderByTypegooseClass(typegooseClass) {
    return {
        provide: getModelToken(typegooseClass.name),
        useFactory: (connection) => (0, typegoose_1.getModelForClass)(typegooseClass, { existingConnection: connection }),
        inject: [system_constant_1.DB_CONNECTION_TOKEN]
    };
}
function InjectModel(model) {
    return (0, common_1.Inject)(getModelToken(model.name));
}
//# sourceMappingURL=model.transformer.js.map