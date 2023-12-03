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
exports.AnnouncementService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const announcement_model_1 = require("./announcement.model");
let AnnouncementService = class AnnouncementService {
    constructor(announcementModel) {
        this.announcementModel = announcementModel;
    }
    paginator(query, options) {
        return this.announcementModel.paginate(query, options);
    }
    create(announcement) {
        return this.announcementModel.create(announcement);
    }
    update(announcementID, announcement) {
        return this.announcementModel
            .findByIdAndUpdate(announcementID, announcement, { new: true })
            .exec()
            .then((result) => result || Promise.reject(`Announcement '${announcementID}' not found`));
    }
    delete(announcementID) {
        return this.announcementModel
            .findByIdAndDelete(announcementID, null)
            .exec()
            .then((result) => {
            return result !== null && result !== void 0 ? result : Promise.reject(`Announcement '${announcementID}' not found`);
        });
    }
    batchDelete(announcementIDs) {
        return this.announcementModel.deleteMany({ _id: { $in: announcementIDs } }).exec();
    }
};
exports.AnnouncementService = AnnouncementService;
exports.AnnouncementService = AnnouncementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(announcement_model_1.Announcement)),
    __metadata("design:paramtypes", [Object])
], AnnouncementService);
//# sourceMappingURL=announcement.service.js.map