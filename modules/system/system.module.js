"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemModule = void 0;
const common_1 = require("@nestjs/common");
const tag_module_1 = require("../tag/tag.module");
const vote_module_1 = require("../vote/vote.module");
const article_module_1 = require("../article/article.module");
const comment_module_1 = require("../comment/comment.module");
const feedback_module_1 = require("../feedback/feedback.module");
const system_controller_1 = require("./system.controller");
const system_service_statistics_1 = require("./system.service.statistics");
const system_service_dbbackup_1 = require("./system.service.dbbackup");
let SystemModule = class SystemModule {
};
exports.SystemModule = SystemModule;
exports.SystemModule = SystemModule = __decorate([
    (0, common_1.Module)({
        imports: [tag_module_1.TagModule, vote_module_1.VoteModule, article_module_1.ArticleModule, comment_module_1.CommentModule, feedback_module_1.FeedbackModule],
        controllers: [system_controller_1.SystemController],
        providers: [system_service_statistics_1.StatisticsService, system_service_dbbackup_1.DBBackupService],
        exports: [system_service_statistics_1.StatisticsService, system_service_dbbackup_1.DBBackupService]
    })
], SystemModule);
//# sourceMappingURL=system.module.js.map