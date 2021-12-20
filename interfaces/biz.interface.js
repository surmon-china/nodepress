"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortType = exports.CommentParentID = exports.CommentPostID = exports.CommentState = exports.OriginState = exports.PublicState = exports.PublishState = void 0;
var PublishState;
(function (PublishState) {
    PublishState[PublishState["Draft"] = 0] = "Draft";
    PublishState[PublishState["Published"] = 1] = "Published";
    PublishState[PublishState["Recycle"] = -1] = "Recycle";
})(PublishState = exports.PublishState || (exports.PublishState = {}));
var PublicState;
(function (PublicState) {
    PublicState[PublicState["Password"] = 0] = "Password";
    PublicState[PublicState["Public"] = 1] = "Public";
    PublicState[PublicState["Secret"] = -1] = "Secret";
})(PublicState = exports.PublicState || (exports.PublicState = {}));
var OriginState;
(function (OriginState) {
    OriginState[OriginState["Original"] = 0] = "Original";
    OriginState[OriginState["Reprint"] = 1] = "Reprint";
    OriginState[OriginState["Hybrid"] = 2] = "Hybrid";
})(OriginState = exports.OriginState || (exports.OriginState = {}));
var CommentState;
(function (CommentState) {
    CommentState[CommentState["Auditing"] = 0] = "Auditing";
    CommentState[CommentState["Published"] = 1] = "Published";
    CommentState[CommentState["Deleted"] = -1] = "Deleted";
    CommentState[CommentState["Spam"] = -2] = "Spam";
})(CommentState = exports.CommentState || (exports.CommentState = {}));
var CommentPostID;
(function (CommentPostID) {
    CommentPostID[CommentPostID["Guestbook"] = 0] = "Guestbook";
})(CommentPostID = exports.CommentPostID || (exports.CommentPostID = {}));
var CommentParentID;
(function (CommentParentID) {
    CommentParentID[CommentParentID["Self"] = 0] = "Self";
})(CommentParentID = exports.CommentParentID || (exports.CommentParentID = {}));
var SortType;
(function (SortType) {
    SortType[SortType["Asc"] = 1] = "Asc";
    SortType[SortType["Desc"] = -1] = "Desc";
    SortType[SortType["Hot"] = 2] = "Hot";
})(SortType = exports.SortType || (exports.SortType = {}));
//# sourceMappingURL=biz.interface.js.map