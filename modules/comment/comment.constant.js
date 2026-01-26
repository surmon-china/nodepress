"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMENT_GUEST_QUERY_FILTER = exports.COMMENT_STATUSES = exports.CommentStatus = void 0;
var CommentStatus;
(function (CommentStatus) {
    CommentStatus[CommentStatus["Pending"] = 0] = "Pending";
    CommentStatus[CommentStatus["Published"] = 1] = "Published";
    CommentStatus[CommentStatus["Trash"] = -1] = "Trash";
    CommentStatus[CommentStatus["Spam"] = -2] = "Spam";
})(CommentStatus || (exports.CommentStatus = CommentStatus = {}));
exports.COMMENT_STATUSES = [
    CommentStatus.Pending,
    CommentStatus.Published,
    CommentStatus.Trash,
    CommentStatus.Spam
];
exports.COMMENT_GUEST_QUERY_FILTER = Object.freeze({
    status: CommentStatus.Published
});
//# sourceMappingURL=comment.constant.js.map