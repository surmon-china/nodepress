"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOTE_AUTHOR_TYPES = exports.VOTE_TARGETS = exports.VOTE_TYPES = exports.VoteAuthorType = exports.voteTypesMap = exports.VoteType = exports.VoteTarget = void 0;
var VoteTarget;
(function (VoteTarget) {
    VoteTarget[VoteTarget["Article"] = 1] = "Article";
    VoteTarget[VoteTarget["Comment"] = 2] = "Comment";
})(VoteTarget || (exports.VoteTarget = VoteTarget = {}));
var VoteType;
(function (VoteType) {
    VoteType[VoteType["Upvote"] = 1] = "Upvote";
    VoteType[VoteType["Downvote"] = -1] = "Downvote";
})(VoteType || (exports.VoteType = VoteType = {}));
exports.voteTypesMap = new Map([
    [VoteType.Upvote, '+1'],
    [VoteType.Downvote, '-1']
]);
var VoteAuthorType;
(function (VoteAuthorType) {
    VoteAuthorType[VoteAuthorType["Anonymous"] = 0] = "Anonymous";
    VoteAuthorType[VoteAuthorType["Guest"] = 1] = "Guest";
    VoteAuthorType[VoteAuthorType["Disqus"] = 2] = "Disqus";
})(VoteAuthorType || (exports.VoteAuthorType = VoteAuthorType = {}));
exports.VOTE_TYPES = [VoteType.Upvote, VoteType.Downvote];
exports.VOTE_TARGETS = [VoteTarget.Article, VoteTarget.Comment];
exports.VOTE_AUTHOR_TYPES = [VoteAuthorType.Anonymous, VoteAuthorType.Guest, VoteAuthorType.Disqus];
//# sourceMappingURL=vote.constant.js.map