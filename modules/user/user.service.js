"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const event_emitter_1 = require("@nestjs/event-emitter");
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const events_constant_1 = require("../../constants/events.constant");
const app_environment_1 = require("../../app.environment");
const logger_1 = require("../../utils/logger");
const user_model_1 = require("./user.model");
const logger = (0, logger_1.createLogger)({ scope: 'UserService', time: app_environment_1.isDevEnv });
let UserService = class UserService {
    eventEmitter;
    userModel;
    constructor(eventEmitter, userModel) {
        this.eventEmitter = eventEmitter;
        this.userModel = userModel;
    }
    async findOne(userId) {
        const user = await this.userModel.findOne({ id: userId }).lean().exec();
        if (!user)
            throw new common_1.NotFoundException(`User '${userId}' not found`);
        return user;
    }
    findOneByIdentity(provider, uid) {
        return this.userModel.findOne({ 'identities.provider': provider, 'identities.uid': uid }).lean().exec();
    }
    async pushIdentity(userId, identity) {
        return this.userModel
            .updateOne({ id: userId, 'identities.provider': { $ne: identity.provider } }, { $push: { identities: { ...identity, linked_at: new Date() } } })
            .lean()
            .exec();
    }
    async pullIdentity(userId, provider) {
        return this.userModel
            .updateOne({ id: userId }, { $pull: { identities: { provider } } })
            .lean()
            .exec();
    }
    paginate(filter, options) {
        return this.userModel.paginateRaw(filter, options);
    }
    async create(input) {
        const created = (await this.userModel.create(input)).toObject();
        this.eventEmitter.emit(events_constant_1.EventKeys.UserCreated, created);
        return created;
    }
    async update(userId, input) {
        const updated = await this.userModel
            .findOneAndUpdate({ id: userId }, { $set: input }, { returnDocument: 'after' })
            .lean()
            .exec();
        if (!updated)
            throw new common_1.NotFoundException(`User '${userId}' not found`);
        return updated;
    }
    async delete(userId) {
        const deleted = await this.userModel.findOneAndDelete({ id: userId }).lean().exec();
        if (!deleted)
            throw new common_1.NotFoundException(`User '${userId}' not found`);
        this.eventEmitter.emit(events_constant_1.EventKeys.UserDeleted, deleted);
        return deleted;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2, Object])
], UserService);
//# sourceMappingURL=user.service.js.map