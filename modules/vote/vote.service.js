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
exports.VoteService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const model_transformer_1 = require("../../transformers/model.transformer");
const events_constant_1 = require("../../constants/events.constant");
const vote_model_1 = require("./vote.model");
let VoteService = class VoteService {
    eventEmitter;
    voteModel;
    constructor(eventEmitter, voteModel) {
        this.eventEmitter = eventEmitter;
        this.voteModel = voteModel;
    }
    countDocuments(filter) {
        return this.voteModel.countDocuments(filter).lean().exec();
    }
    paginate(filter, options) {
        return this.voteModel.paginateRaw(filter, { ...options, lean: { virtuals: true } });
    }
    async create(vote) {
        const created = await this.voteModel.create(vote);
        const populated = await created.populate('user');
        this.eventEmitter.emit(events_constant_1.GlobalEventKey.VoteCreated, populated.toObject());
        return populated;
    }
    async delete(voteId) {
        const deleted = await this.voteModel.findOneAndDelete({ id: voteId }).exec();
        if (!deleted)
            throw new common_1.NotFoundException(`Vote '${voteId}' not found`);
        return deleted;
    }
    batchDelete(voteIds) {
        return this.voteModel.deleteMany({ id: { $in: voteIds } }).exec();
    }
};
exports.VoteService = VoteService;
exports.VoteService = VoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, model_transformer_1.InjectModel)(vote_model_1.Vote)),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2, Object])
], VoteService);
//# sourceMappingURL=vote.service.js.map