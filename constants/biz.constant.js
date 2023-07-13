"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROOT_FEEDBACK_TID = exports.ROOT_COMMENT_PID = exports.GUESTBOOK_POST_ID = exports.CommentState = exports.OriginState = exports.PublicState = exports.PublishState = exports.SortType = exports.Language = void 0;
var Language;
(function (Language) {
    Language["English"] = "en";
    Language["Chinese"] = "zh";
})(Language || (exports.Language = Language = {}));
var SortType;
(function (SortType) {
    SortType[SortType["Asc"] = 1] = "Asc";
    SortType[SortType["Desc"] = -1] = "Desc";
    SortType[SortType["Hottest"] = 2] = "Hottest";
})(SortType || (exports.SortType = SortType = {}));
var PublishState;
(function (PublishState) {
    PublishState[PublishState["Draft"] = 0] = "Draft";
    PublishState[PublishState["Published"] = 1] = "Published";
    PublishState[PublishState["Recycle"] = -1] = "Recycle";
})(PublishState || (exports.PublishState = PublishState = {}));
var PublicState;
(function (PublicState) {
    PublicState[PublicState["Public"] = 1] = "Public";
    PublicState[PublicState["Secret"] = -1] = "Secret";
    PublicState[PublicState["Reserve"] = 0] = "Reserve";
})(PublicState || (exports.PublicState = PublicState = {}));
var OriginState;
(function (OriginState) {
    OriginState[OriginState["Original"] = 0] = "Original";
    OriginState[OriginState["Reprint"] = 1] = "Reprint";
    OriginState[OriginState["Hybrid"] = 2] = "Hybrid";
})(OriginState || (exports.OriginState = OriginState = {}));
var CommentState;
(function (CommentState) {
    CommentState[CommentState["Auditing"] = 0] = "Auditing";
    CommentState[CommentState["Published"] = 1] = "Published";
    CommentState[CommentState["Deleted"] = -1] = "Deleted";
    CommentState[CommentState["Spam"] = -2] = "Spam";
})(CommentState || (exports.CommentState = CommentState = {}));
exports.GUESTBOOK_POST_ID = 0;
exports.ROOT_COMMENT_PID = 0;
exports.ROOT_FEEDBACK_TID = 0;
//# sourceMappingURL=biz.constant.js.map