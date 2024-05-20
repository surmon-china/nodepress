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
const model_transformer_1 = require("../../transformers/model.transformer");
const vote_model_1 = require("./vote.model");
let VoteService = class VoteService {
    constructor(voteModel) {
        this.voteModel = voteModel;
    }
    paginator(query, options) {
        return this.voteModel.paginate(query, options);
    }
    create(vote) {
        return this.voteModel.create(vote);
    }
    async update(voteId, newVote) {
        const vote = await this.voteModel.findByIdAndUpdate(voteId, newVote, { new: true }).exec();
        if (!vote) {
            throw `Vote '${voteId}' not found`;
        }
        return vote;
    }
    async delete(voteId) {
        const vote = await this.voteModel.findByIdAndDelete(voteId, null).exec();
        if (!vote) {
            throw `Vote '${voteId}' not found`;
        }
        return vote;
    }
    batchDelete(voteIds) {
        return this.voteModel.deleteMany({ _id: { $in: voteIds } }).exec();
    }
    async countDocuments(filter, options) {
        return await this.voteModel.countDocuments(filter, options).exec();
    }
};
exports.VoteService = VoteService;
exports.VoteService = VoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(vote_model_1.Vote)),
    __metadata("design:paramtypes", [Object])
], VoteService);
//# sourceMappingURL=vote.service.js.map