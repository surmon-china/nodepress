"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpansionModule = void 0;
const common_1 = require("@nestjs/common");
const tag_module_1 = require("../tag/tag.module");
const article_module_1 = require("../article/article.module");
const comment_module_1 = require("../comment/comment.module");
const feedback_module_1 = require("../feedback/feedback.module");
const expansion_controller_1 = require("./expansion.controller");
const expansion_service_statistic_1 = require("./expansion.service.statistic");
const expansion_service_dbbackup_1 = require("./expansion.service.dbbackup");
let ExpansionModule = exports.ExpansionModule = class ExpansionModule {
};
exports.ExpansionModule = ExpansionModule = __decorate([
    (0, common_1.Module)({
        imports: [tag_module_1.TagModule, article_module_1.ArticleModule, comment_module_1.CommentModule, feedback_module_1.FeedbackModule],
        controllers: [expansion_controller_1.ExpansionController],
        providers: [expansion_service_statistic_1.StatisticService, expansion_service_dbbackup_1.DBBackupService],
        exports: [expansion_service_statistic_1.StatisticService, expansion_service_dbbackup_1.DBBackupService]
    })
], ExpansionModule);
//# sourceMappingURL=expansion.module.js.map