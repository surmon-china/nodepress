"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionModule = void 0;
const common_1 = require("@nestjs/common");
const tag_module_1 = require("../tag/tag.module");
const vote_module_1 = require("../vote/vote.module");
const article_module_1 = require("../article/article.module");
const comment_module_1 = require("../comment/comment.module");
const feedback_module_1 = require("../feedback/feedback.module");
const extension_controller_1 = require("./extension.controller");
const extension_service_statistic_1 = require("./extension.service.statistic");
const extension_service_dbbackup_1 = require("./extension.service.dbbackup");
let ExtensionModule = class ExtensionModule {
};
exports.ExtensionModule = ExtensionModule;
exports.ExtensionModule = ExtensionModule = __decorate([
    (0, common_1.Module)({
        imports: [tag_module_1.TagModule, vote_module_1.VoteModule, article_module_1.ArticleModule, comment_module_1.CommentModule, feedback_module_1.FeedbackModule],
        controllers: [extension_controller_1.ExtensionController],
        providers: [extension_service_statistic_1.StatisticService, extension_service_dbbackup_1.DBBackupService],
        exports: [extension_service_statistic_1.StatisticService, extension_service_dbbackup_1.DBBackupService]
    })
], ExtensionModule);
//# sourceMappingURL=extension.module.js.map