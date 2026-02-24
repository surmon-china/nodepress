"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentNotificationEmail = void 0;
const comment_constant_1 = require("./comment.constant");
const getCommentNotificationEmail = (commentWithUser) => {
    switch (commentWithUser.author_status) {
        case comment_constant_1.CommentAuthorStatus.Ghost:
            return null;
        case comment_constant_1.CommentAuthorStatus.Active:
            return commentWithUser.user?.email ?? null;
        case comment_constant_1.CommentAuthorStatus.Guest:
            return commentWithUser.author_email ?? null;
        default:
            return null;
    }
};
exports.getCommentNotificationEmail = getCommentNotificationEmail;
//# sourceMappingURL=comment.helper.js.map