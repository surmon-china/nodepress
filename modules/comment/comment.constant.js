"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMENT_PUBLIC_FILTER = exports.CommentAuthorStatus = exports.CommentAuthorType = exports.CommentStatus = exports.CommentTargetType = void 0;
var CommentTargetType;
(function (CommentTargetType) {
    CommentTargetType["Article"] = "article";
    CommentTargetType["Page"] = "page";
})(CommentTargetType || (exports.CommentTargetType = CommentTargetType = {}));
var CommentStatus;
(function (CommentStatus) {
    CommentStatus[CommentStatus["Pending"] = 0] = "Pending";
    CommentStatus[CommentStatus["Published"] = 1] = "Published";
    CommentStatus[CommentStatus["Trash"] = -1] = "Trash";
    CommentStatus[CommentStatus["Spam"] = -2] = "Spam";
})(CommentStatus || (exports.CommentStatus = CommentStatus = {}));
var CommentAuthorType;
(function (CommentAuthorType) {
    CommentAuthorType["Guest"] = "guest";
    CommentAuthorType["User"] = "user";
})(CommentAuthorType || (exports.CommentAuthorType = CommentAuthorType = {}));
var CommentAuthorStatus;
(function (CommentAuthorStatus) {
    CommentAuthorStatus["Guest"] = "guest";
    CommentAuthorStatus["Active"] = "active";
    CommentAuthorStatus["Ghost"] = "ghost";
})(CommentAuthorStatus || (exports.CommentAuthorStatus = CommentAuthorStatus = {}));
exports.COMMENT_PUBLIC_FILTER = Object.freeze({
    status: CommentStatus.Published
});
//# sourceMappingURL=comment.constant.js.map